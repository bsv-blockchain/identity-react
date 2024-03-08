/// <reference types="react" />
import { Identity } from "../types/metanet-identity-types";
interface UseIdentitySearchProps {
    confederacyHost?: string;
    onIdentitySelected?: (selectedIdentity: Identity) => void;
}
export declare const useIdentitySearch: ({ confederacyHost, onIdentitySelected, }?: UseIdentitySearchProps) => {
    confederacyHost: string;
    inputValue: string;
    setInputValue: (_: React.SyntheticEvent, newInputValue: string) => void;
    selectedIdentity: Identity | null;
    setSelectedIdentity: (_: React.SyntheticEvent, newValue: Identity | null) => void;
    identities: Identity[];
    isLoading: boolean;
    setIsLoading: import("react").Dispatch<import("react").SetStateAction<boolean>>;
};
export {};
//# sourceMappingURL=useIdentitySearch.d.ts.map