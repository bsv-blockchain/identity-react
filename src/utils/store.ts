import { create } from 'zustand'
import { discoverByIdentityKey, discoverByAttributes } from '@babbage/sdk-ts'
import { IdentityStore, SigniaResult } from '../types/metanet-identity-types'
import { isIdentityKey } from './identityUtils'
import { parseIdentity } from 'identinator'

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

    const matchingIdentities = (results as SigniaResult[]).map((result: SigniaResult) => {
      return parseIdentity(result)
    })
    setIsLoading(false)

    set({ identities: matchingIdentities })
  },
}))
