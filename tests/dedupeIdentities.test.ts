import { describe, expect, it } from 'vitest'
import { defaultIdentity } from '@bsv/sdk'
import { dedupeIdentitiesByKey } from '../src/utils/dedupeIdentities'

const keyA = `03${'a'.repeat(64)}`
const keyB = `02${'b'.repeat(64)}`

describe('dedupeIdentitiesByKey', () => {
  it('keeps separate keys with the same name and one result for case-variant duplicate keys', () => {
    const first = { ...defaultIdentity, identityKey: keyA, name: 'bob@projectbabbage.com' }
    const second = { ...defaultIdentity, identityKey: keyB, name: first.name }
    const duplicate = { ...second, identityKey: keyB.toUpperCase() }

    expect(dedupeIdentitiesByKey([first, second, duplicate], 'bob@proj')).toEqual([first, second])
  })

  it('prefers the certificate field type that matches an email search', () => {
    const generic = {
      ...defaultIdentity,
      identityKey: keyB,
      name: 'Bob',
      badgeLabel: 'Entity certified by Example'
    }
    const email = {
      ...defaultIdentity,
      identityKey: keyB,
      name: 'bob@projectbabbage.com',
      badgeLabel: 'Email certified by Example'
    }

    expect(dedupeIdentitiesByKey([generic, email], 'bob@proj')).toEqual([email])
  })

  it('keeps the first certificate when both presentations match equally', () => {
    const first = { ...defaultIdentity, identityKey: keyA, name: 'Brayden' }
    const second = { ...first, avatarURL: 'different-avatar' }

    expect(dedupeIdentitiesByKey([first, second], 'brayden')).toEqual([first])
  })

  it('prefers a phone certificate for a phone-number query', () => {
    const generic = {
      ...defaultIdentity,
      identityKey: keyA,
      name: 'Contact',
      badgeLabel: 'Entity certified by Example'
    }
    const phone = {
      ...defaultIdentity,
      identityKey: keyA,
      name: '+12025550123',
      badgeLabel: 'Phone certified by Example'
    }

    expect(dedupeIdentitiesByKey([generic, phone], '+1202555')).toEqual([phone])
  })

  it('drops entries without an identity key', () => {
    const empty = { ...defaultIdentity, identityKey: '', name: 'Unknown' }
    const valid = { ...defaultIdentity, identityKey: keyA, name: 'Alice' }

    expect(dedupeIdentitiesByKey([empty, valid], 'alice')).toEqual([valid])
  })
})
