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
    console.log('checkl')
    if (isIdentityKey(query)) {
      console.log('match')
      results = await discoverByIdentityKey({
        identityKey: query,
        description: 'Discover MetaNet Identity'
      })
      console.log(results)
    } else {
      results = await discoverByAttributes({
        attributes: {
          any: query
        },
        description: 'Discover MetaNet Identity'
      })
      console.log(results)
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
        certifier: x.certifier,
        certificateType: x.type
      }
    })
    setIsLoading(false)

    // console.log('id', matchingIdentities)
    // if ((!matchingIdentities || matchingIdentities.length === 0) && isIdentityKey(query)) {
    //   set({
    //     identities: [{
    //       name: 'Stranger',
    //       profilePhoto: '',
    //       identityKey: query,
    //       certificateType: 'Unknown'
    //     }]
    //   })
    // } else {
    set({ identities: matchingIdentities })
    // }
  },
}))
