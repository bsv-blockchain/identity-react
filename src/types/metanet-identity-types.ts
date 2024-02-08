import { Dispatch, SetStateAction } from "react"

export interface DecryptedField {
    firstName: string
    lastName: string
    profilePhoto: string
}
export interface Certifier {
  publicKey: string,
  icon: string,
  name: string
}
export interface SigniaResult {
    subject: string
    decryptedFields: DecryptedField
    certifier: Certifier
}

export interface IdentityProps {
  identityKey: string,
  confederacyHost?: string,
  themeMode?: 'light' | 'dark'
}

export interface IdentityStore {
    identities: Identity[]
    fetchIdentities: (query: string, setIsLoading: Dispatch<SetStateAction<boolean>>) => void
}

export interface Identity {
    name: string
    profilePhoto: string
    identityKey: string
    certifier: Certifier
}