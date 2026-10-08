import type { DisplayableIdentity } from '@bsv/sdk'

const scoreIdentity = (identity: DisplayableIdentity, query: string): number => {
  const name = identity.name?.trim().toLowerCase() ?? ''
  const badge = identity.badgeLabel?.toLowerCase() ?? ''
  let score = 0

  if (identity.identityKey.toLowerCase() === query) score += 1000
  if (query.includes('@') && badge.startsWith('email')) score += 100
  if (/^\+?[\d\s().-]{5,}$/.test(query) && badge.startsWith('phone')) score += 100
  if (name === query) score += 50
  else if (name.startsWith(query)) score += 30
  else if (name.includes(query)) score += 10

  return score
}

/** Keep the best matching certificate presentation for each identity key. */
export const dedupeIdentitiesByKey = (
  identities: DisplayableIdentity[],
  query: string
): DisplayableIdentity[] => {
  const normalizedQuery = query.trim().toLowerCase()
  const results: DisplayableIdentity[] = []
  const indexByKey = new Map<string, number>()

  for (const identity of identities) {
    const key = identity.identityKey.trim().toLowerCase()
    if (!key) continue
    const existingIndex = indexByKey.get(key)
    if (existingIndex === undefined) {
      indexByKey.set(key, results.length)
      results.push(identity)
    } else if (
      scoreIdentity(identity, normalizedQuery) >
      scoreIdentity(results[existingIndex], normalizedQuery)
    ) {
      results[existingIndex] = identity
    }
  }

  return results
}
