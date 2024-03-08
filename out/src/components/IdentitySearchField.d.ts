import React from 'react';
import { Identity } from '../types/metanet-identity-types';
import { Theme } from '@mui/material/styles';
export interface IdentitySearchFieldProps {
    theme?: Theme;
    font?: string;
    confederacyHost?: string;
    onIdentitySelected?: (selectedIdentity: Identity) => void;
}
declare const IdentitySearchField: React.FC<IdentitySearchFieldProps>;
export default IdentitySearchField;
//# sourceMappingURL=IdentitySearchField.d.ts.map