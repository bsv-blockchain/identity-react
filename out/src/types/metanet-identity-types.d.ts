import { Dispatch, SetStateAction } from "react";
export interface DecryptedField {
    profilePhoto: string;
    firstName?: string;
    lastName?: string;
    userName?: string;
}
export interface Certifier {
    publicKey: string;
    icon: string;
    name: string;
}
export interface SigniaResult {
    subject: string;
    decryptedFields: DecryptedField;
    certifier: Certifier;
}
export interface IdentityProps {
    identityKey: string;
    confederacyHost?: string;
    themeMode?: 'light' | 'dark';
}
export interface IdentityStore {
    identities: Identity[];
    fetchIdentities: (query: string, setIsLoading: Dispatch<SetStateAction<boolean>>) => void;
}
export interface Identity {
    name: string;
    profilePhoto: string;
    identityKey: string;
    certifier: Certifier;
}
//# sourceMappingURL=metanet-identity-types.d.ts.map