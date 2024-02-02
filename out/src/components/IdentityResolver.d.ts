import React from 'react';
import { Identity } from '../utils/store';
interface IdentityResolverProps {
    backgroundColor?: string;
    font?: string;
    confederacyHost?: string;
    onIdentitySelected?: (selectedIdentity: Identity) => void;
}
declare const IdentityResolver: React.FC<IdentityResolverProps>;
export default IdentityResolver;
//# sourceMappingURL=IdentityResolver.d.ts.map