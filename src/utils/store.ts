import { create } from 'zustand'
import { IdentityStore } from '../types'
import { isIdentityKey } from './identityUtils'
import { IdentityClient, DisplayableIdentity } from '@bsv/sdk'

const client = new IdentityClient()

export const useStore = create<IdentityStore>((set) => ({
  identities: [],
  fetchIdentities: async (query: string, setIsLoading) => {
    setIsLoading(true)
    try {
      let results: DisplayableIdentity[]
      
      // Figure out if the query is by IdentityKey
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
      
      set({ identities: results })
    } catch (error) {
      console.error('Identity fetch error:', error)
      set({ identities: [] })
    } finally {
      setIsLoading(false)
    }
  },
}))
