import { Dispatch, SetStateAction } from "react"

export interface DecryptedField {
  profilePhoto: string
  firstName?: string
  lastName?: string
  userName?: string
  name?: string,
  email?: string
  phoneNumber?: string
}
export interface Certifier {
  publicKey: string
  icon: string
  name: string
}
export interface SigniaResult {
  certifier: Certifier
  decryptedFields: DecryptedField
  subject: string
  type: string
  signature: string
}

export interface IdentityProps {
  identityKey: string
  confederacyHost?: string
  themeMode?: "light" | "dark"
}

export interface IdentityStore {
  identities: Identity[]
  fetchIdentities: (
    query: string,
    setIsLoading: Dispatch<SetStateAction<boolean>>
  ) => Promise<void>
}

export interface Identity {
  name: string
  profilePhoto: string
  identityKey: string
  certifier?: Certifier
  certificateType?: string
  decryptedFields?: any
}
