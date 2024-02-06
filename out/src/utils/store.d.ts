import { Dispatch, SetStateAction } from 'react';
export type Identity = {
    name: string;
    profilePhoto: string;
    identityKey: string;
    certifier: Certifier;
};
interface IdentityStore {
    identities: Identity[];
    fetchIdentities: (query: string, setIsLoading: Dispatch<SetStateAction<boolean>>) => void;
}
interface Certifier {
    publicKey: string;
    icon: string;
}
export declare const useStore: import("zustand").UseBoundStore<import("zustand").StoreApi<IdentityStore>>;
export {};
//# sourceMappingURL=store.d.ts.map