import { DisplayableIdentity } from "@bsv/sdk"
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

export interface IdentityProps {
  identityKey: string
  themeMode?: "light" | "dark"
}

export interface IdentityStore {
  identities: DisplayableIdentity[]
  fetchIdentities: (
    query: string,
    setIsLoading: Dispatch<SetStateAction<boolean>>
  ) => Promise<void>
}
