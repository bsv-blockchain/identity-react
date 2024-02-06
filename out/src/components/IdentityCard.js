"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const material_1 = require("@mui/material");
const react_1 = require("react");
const sdk_ts_1 = require("@babbage/sdk-ts");
const uhrp_react_1 = require("uhrp-react");
const IdentityCard = ({ identityKey, confederacyHost = 'https://confederacy.babbage.systems' }) => {
    const [resolvedIdentity, setResolvedIdentity] = (0, react_1.useState)({ name: 'Unknown', profilePhoto: 'https://cdn4.iconfinder.com/data/icons/political-elections/50/48-512.png' });
    (0, react_1.useEffect)(() => {
        (async () => {
            try {
                // Resolve a Signia verified identity from a counterparty
                // debugger
                const matchingIdentities = await (0, sdk_ts_1.discoverByIdentityKey)({
                    identityKey,
                    description: 'Resolve identity information from your trusted certifiers.'
                });
                // Do we want to just pick the most trusted result?
                if (matchingIdentities.length > 0) {
                    const selectedIdentity = matchingIdentities[0];
                    setResolvedIdentity({
                        name: selectedIdentity.decryptedFields.firstName,
                        profilePhoto: selectedIdentity.decryptedFields.profilePhoto,
                        identityKey: selectedIdentity.subject,
                        certifier: selectedIdentity.certifier
                    });
                }
            }
            catch (e) { }
        })();
    }, []);
    return ((0, jsx_runtime_1.jsxs)(material_1.Card, { sx: { display: 'flex', alignItems: 'center', borderRadius: '16px', padding: '0.2em 0.4em 0.2em 0.5em', maxWidth: 345, backgroundColor: 'transparent' }, children: [(0, jsx_runtime_1.jsx)(material_1.Avatar, { alt: resolvedIdentity.name, sx: { width: '2.5em', height: '2.5em' }, children: (0, jsx_runtime_1.jsx)(uhrp_react_1.Img, { style: { width: '100%', height: 'auto' }, src: resolvedIdentity.profilePhoto, confederacyHost: confederacyHost, loading: undefined }) }), (0, jsx_runtime_1.jsxs)(material_1.CardContent, { sx: { flex: '1 0 auto', padding: '8px !important', "&:last-child": { paddingBottom: '8px !important' } }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h6", component: "div", fontSize: '1em', children: resolvedIdentity.name }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body2", color: "text.secondary", children: identityKey ? identityKey.slice(0, 10) : (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}) })] })] }));
};
exports.default = IdentityCard;
//# sourceMappingURL=IdentityCard.js.map