// store.ts
import { create } from 'zustand'
import { discoverByIdentityKey, discoverByAttributes, createAction } from '@babbage/sdk'
import { Dispatch, SetStateAction } from 'react'

export interface Identity {
//   id: number
  name: string
  profilePhoto: string,
  identityKey: string
}

interface IdentityStore {
  identities: Identity[]
  fetchIdentities: (query: string, setIsLoading: Dispatch<SetStateAction<boolean>>) => void
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
  fetchIdentities: debounce(async (query, setIsLoading) => {
    console.log('is it fetching...?')

    setIsLoading(true)
    const results = await discoverByAttributes({ attributes: { firstName: query} })
    const matchingIdentities = results.map((x: { subject: string, decryptedFields: { firstName: string, profilePhoto: string } }) => {
        return {
            name: x.decryptedFields.firstName,
            profilePhoto: x.decryptedFields.profilePhoto,
            identityKey: x.subject
        }
    } )
    console.log(matchingIdentities)
    setIsLoading(false)

    set({ identities: matchingIdentities })
  }, 500),
}))
