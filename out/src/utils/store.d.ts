import { Dispatch, SetStateAction } from 'react';
export interface Identity {
    name: string;
    profilePhoto: string;
    identityKey: string;
    certifier: string;
}
interface IdentityStore {
    identities: Identity[];
    fetchIdentities: (query: string, setIsLoading: Dispatch<SetStateAction<boolean>>) => void;
}
export declare const useStore: import("zustand").UseBoundStore<import("zustand").StoreApi<IdentityStore>>;
export {};
//# sourceMappingURL=store.d.ts.map