import React from 'react';
import { Identity } from '../utils/store';
export interface IdentityResolverProps {
    backgroundColor?: string;
    font?: string;
    confederacyHost?: string;
    onIdentitySelected?: (selectedIdentity: Identity) => void;
}
declare const IdentityResolver: React.FC<IdentityResolverProps>;
export default IdentityResolver;
//# sourceMappingURL=IdentitySearch.d.ts.map