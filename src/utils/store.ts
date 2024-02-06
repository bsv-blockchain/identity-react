import { create } from 'zustand'
import { discoverByIdentityKey, discoverByAttributes } from '@babbage/sdk-ts'
import { IdentityStore, SigniaResult } from '../types/metanet-identity-types'

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
