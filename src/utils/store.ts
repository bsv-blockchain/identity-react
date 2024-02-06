import { create } from 'zustand'
import { discoverByIdentityKey, discoverByAttributes } from '@babbage/sdk-ts'
import { Dispatch, SetStateAction } from 'react'

export type Identity = {
  name: string
  profilePhoto: string
  identityKey: string
  certifier: Certifier
}

interface IdentityStore {
  identities: Identity[]
  fetchIdentities: (query: string, setIsLoading: Dispatch<SetStateAction<boolean>>) => void
}

interface DecryptedField {
    firstName: string
    profilePhoto: string
}

interface Certifier {
  publicKey: string,
  icon: string
}

interface SigniaResult {
    subject: string
    decryptedFields: DecryptedField
    certifier: Certifier
}

function debounce<F extends (...args: any[]) => void>(func: F, waitFor: number): (...args: Parameters<F>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return function(...args: Parameters<F>) {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => func(...args), waitFor)
  }
}

export const useStore = create<IdentityStore>((set) => ({
  identities: [],
  fetchIdentities: debounce(async (query: string, setIsLoading) => {
    console.log('is it fetching...?')

    setIsLoading(true)
    const results = await discoverByAttributes({
      attributes: { firstName: query },
      description: 'Discover MetaNet Identity'
    })
    const matchingIdentities = (results as SigniaResult[]).map((x: SigniaResult) => {
        return {
            name: x.decryptedFields.firstName,
            profilePhoto: x.decryptedFields.profilePhoto,
            identityKey: x.subject,
            certifier: x.certifier
        }
    } )
    console.log(matchingIdentities)
    setIsLoading(false)

    set({ identities: matchingIdentities })
  }, 500),
}))
