import { create } from 'zustand'
import { discoverByIdentityKey, discoverByAttributes } from '@babbage/sdk-ts'
import { IdentityStore, SigniaResult } from '../types/metanet-identity-types'

function debounce<F extends (...args: any[]) => void>(func: F, waitFor: number): (...args: Parameters<F>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return function (...args: Parameters<F>) {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => func(...args), waitFor)
  }
}

type Query = {
  email?: string
  phone?: string
  userName?: string
  firstName?: string
  lastName?: string
}

const parseAndConstructQuery = (input: string): Query => {
  const query: Query = {}
  // Regular expressions for different patterns
  const emailPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const phonePattern: RegExp = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/
  // const discordPattern: RegExp = /^[a-zA-Z0-9]+$/

  if (emailPattern.test(input)) {
    query.email = input
  } else if (phonePattern.test(input)) {
    query.phone = input
    // } else if (discordPattern.test(input) && input.includes('#')) {
    //   query.userName = input
  } else {
    // Split input by spaces to check for first/last names
    const names: string[] = input.split(' ')
    if (names.length > 1) {
      query.firstName = names[0]
      query.lastName = names.slice(1).join(' ')
    } else {
      query.firstName = input // Default to first name
    }
  }

  return query
}

const isIdentityKey = (key) => {
  const regex = /^(02|03|04)[0-9a-fA-F]{64}$/
  return regex.test(key)
}

export const useStore = create<IdentityStore>((set) => ({
  identities: [],
  fetchIdentities: debounce(async (query: string, setIsLoading) => {
    console.log('is it fetching...?')

    setIsLoading(true)
    let results
    // Figure out if the query is by IdentityKey
    if (isIdentityKey(query)) {
      results = await discoverByIdentityKey({
        identityKey: query,
        description: 'Discover MetaNet Identity'
      })
    } else {
      const queryToSearch = parseAndConstructQuery(query)
      results = await discoverByAttributes({
        attributes: queryToSearch,
        description: 'Discover MetaNet Identity'
      })
      // TODO: Create better solution!
      // Quick Hack to check discord handles
      if (results.length === 0) {
        results = await discoverByAttributes({
          attributes: {
            userName: query
          },
          description: 'Discover MetaNet Identity'
        })
      }
    }

    const matchingIdentities = (results as SigniaResult[]).map((x: SigniaResult) => {

      // Test adding varied name props
      const nameParts: string[] = []
      for (const key in x.decryptedFields) {
        if (key === 'profilePhoto') {
          continue
        }
        nameParts.push(x.decryptedFields[key])
      }

      return {
        name: nameParts.join(' '),
        profilePhoto: x.decryptedFields.profilePhoto,
        identityKey: x.subject,
        certifier: x.certifier
      }
    })
    console.log(matchingIdentities)
    setIsLoading(false)

    set({ identities: matchingIdentities })
  }, 500),
}))
