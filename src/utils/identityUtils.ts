import { discoverByIdentityKey, discoverByAttributes } from "@babbage/sdk-ts"

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const isIdentityKey = (key) => {
  const regex = /^(02|03|04)[0-9a-fA-F]{64}$/
  return regex.test(key)
}

export const fetchIdentities = async (query: string) => {
  let results
  // Figure out if the query is by IdentityKey
  if (isIdentityKey(query)) {
    results = await discoverByIdentityKey({
      identityKey: query,
      description: "Discover MetaNet Identity",
    })
  } else {
    results = await discoverByAttributes({
      attributes: {
        any: query,
      },
      description: "Discover MetaNet Identity",
    })
  }
  return results
}
