import { IdentityClient, KNOWN_IDENTITY_TYPES as knownCertificateTypes, IdentityClientOptions, OriginatorDomainNameStringUnder250Bytes, WalletInterface } from "@bsv/sdk"
import { Certifier } from "../types"

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
export const isIdentityKey = (key: string) => {
  const regex = /^(02|03|04)[0-9a-fA-F]{64}$/
  return regex.test(key)
}

export const fetchIdentities = async (query: string, wallet?: WalletInterface | undefined, options?: IdentityClientOptions | undefined, originator?: OriginatorDomainNameStringUnder250Bytes | undefined) => {
  let results
  const client = new IdentityClient(wallet, options, originator)
  // Figure out if the query is by IdentityKey
  if (isIdentityKey(query)) {
    results = await client.resolveByIdentityKey({
      identityKey: query
    })
  } else {
    results = await client.resolveByAttributes({
      attributes: {
        any: query,
      }
    })
  }
  return results
}

// Returns the correct tool tip depending on the certifier and certificate type
export const getCertifierToolTip = (certifier: Certifier, certificateType: string) => {
  switch (certificateType) {
    case knownCertificateTypes.discordCert:
      return `Discord account certified by ${certifier.name}`
    case knownCertificateTypes.xCert:
      return `X (Twitter) account certified by ${certifier.name}`
    case knownCertificateTypes.phoneCert:
      return `Phone number certified by ${certifier.name}`
    case knownCertificateTypes.emailCert:
      return `Email address certified by ${certifier.name}`
    default:
      return `Certified by ${certifier.name}`
  }
}