import { create } from 'zustand'
import { discoverByIdentityKey, discoverByAttributes } from '@babbage/sdk-ts'
import { IdentityStore, SigniaResult } from '../types/metanet-identity-types'

const isIdentityKey = (key) => {
  const regex = /^(02|03|04)[0-9a-fA-F]{64}$/
  return regex.test(key)
}

export const useStore = create<IdentityStore>((set) => ({
  identities: [],
  fetchIdentities: async (query: string, setIsLoading) => {
    setIsLoading(true)
    let results
    // Figure out if the query is by IdentityKey
    if (isIdentityKey(query)) {
      results = await discoverByIdentityKey({
        identityKey: query,
        description: 'Discover MetaNet Identity'
      })
    } else {
      results = await discoverByAttributes({
        attributes: {
          any: query
        },
        description: 'Discover MetaNet Identity'
      })
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
    setIsLoading(false)

    set({ identities: matchingIdentities })
  },
}))
