import { IdentityClient } from "@bsv/sdk"
import { Certifier } from "../types/metanet-identity-types"

export const knownCertificateTypes = {
  identiCert: 'z40BOInXkI8m7f/wBrv4MJ09bZfzZbTj2fJqCtONqCY=',
  discordCert: '2TgqRC35B1zehGmB21xveZNc7i5iqHc0uxMb+1NMPW4=',
  phoneCert: 'mffUklUzxbHr65xLohn0hRL0Tq2GjW1GYF/OPfzqJ6A=',
  xCert: 'vdDWvftf1H+5+ZprUw123kjHlywH+v20aPQTuXgMpNc=',
  registrant: `YoPsbfR6YQczjzPdHCoGC7nJsOdPQR50+SYqcWpJ0y0=`,
  emailCert: 'exOl3KM0dIJ04EW5pZgbZmPag6MdJXd3/a1enmUU/BA='
}

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
export const isIdentityKey = (key) => {
  const regex = /^(02|03|04)[0-9a-fA-F]{64}$/
  return regex.test(key)
}

export const fetchIdentities = async (query: string) => {
  let results
  const client = new IdentityClient()
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