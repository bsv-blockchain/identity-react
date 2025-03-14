import { create } from 'zustand'
import { IdentityStore } from '../types/metanet-identity-types'
import { isIdentityKey } from './identityUtils'
import { IdentityClient } from '@bsv/sdk'

export const useStore = create<IdentityStore>((set) => ({
  identities: [],
  fetchIdentities: async (query: string, setIsLoading) => {
    setIsLoading(true)
    let results
    // Figure out if the query is by IdentityKey
    const client = new IdentityClient()
    if (isIdentityKey(query)) {
      results = await client.resolveByIdentityKey({
        identityKey: query
      })
    } else {
      results = await client.resolveByAttributes({
        attributes: {
          any: query
        }
      })
    }
    setIsLoading(false)
    set({ identities: results })
  },
}))
