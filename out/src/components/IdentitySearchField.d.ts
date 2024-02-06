import React from 'react';
import { Identity } from '../types/metanet-identity-types';
export interface IdentitySearchFieldProps {
    backgroundColor?: string;
    font?: string;
    confederacyHost?: string;
    onIdentitySelected?: (selectedIdentity: Identity) => void;
}
declare const IdentitySearchField: React.FC<IdentitySearchFieldProps>;
export default IdentitySearchField;
//# sourceMappingURL=IdentitySearchField.d.ts.map