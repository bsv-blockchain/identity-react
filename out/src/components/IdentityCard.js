"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const material_1 = require("@mui/material");
const react_1 = require("react");
const sdk_ts_1 = require("@babbage/sdk-ts");
const uhrp_react_1 = require("uhrp-react");
const knownCertificateTypes = {
    identiCert: 'z40BOInXkI8m7f/wBrv4MJ09bZfzZbTj2fJqCtONqCY=',
    socialCert: '2TgqRC35B1zehGmB21xveZNc7i5iqHc0uxMb+1NMPW4='
};
const IdentityCard = ({ identityKey, confederacyHost = 'https://confederacy.babbage.systems', themeMode = 'light' }) => {
    const [resolvedIdentity, setResolvedIdentity] = (0, react_1.useState)({
        name: 'Stranger',
        profilePhoto: 'https://cdn4.iconfinder.com/data/icons/political-elections/50/48-512.png'
    });
    (0, react_1.useEffect)(() => {
        ;
        (async () => {
            try {
                // Resolve a Signia verified identity from a counterparty
                const matchingIdentities = await (0, sdk_ts_1.discoverByIdentityKey)({
                    identityKey,
                    description: 'Resolve identity information from your trusted certifiers.'
                });
                // Select the first result which is the most trusted
                if (matchingIdentities.length > 0) {
                    const selectedIdentity = matchingIdentities[0];
                    let name = 'Unsupported Name';
                    switch (selectedIdentity.type) {
                        case knownCertificateTypes.identiCert: {
                            const { firstName, lastName } = selectedIdentity.decryptedFields;
                            name = `${firstName} ${lastName}`;
                            break;
                        }
                        case knownCertificateTypes.socialCert: {
                            const { userName, email, phoneNumber } = selectedIdentity.decryptedFields;
                            name = userName || email || phoneNumber || name;
                            break;
                        }
                        default:
                            break;
                    }
                    setResolvedIdentity({
                        name,
                        profilePhoto: selectedIdentity.decryptedFields.profilePhoto,
                        identityKey: selectedIdentity.subject,
                        certifier: selectedIdentity.certifier
                    });
                }
            }
            catch (e) {
                console.error(e);
            }
        })();
    }, [identityKey]);
    return ((0, jsx_runtime_1.jsxs)(material_1.Box, { sx: {
            display: 'flex',
            alignItems: 'center',
            borderRadius: '16px',
            padding: '0.2em 0.4em 0.2em 0.5em',
            maxWidth: 345,
            border: 'none',
            backgroundColor: 'transparent'
        }, children: [(0, jsx_runtime_1.jsx)(material_1.Tooltip, { title: resolvedIdentity.certifier
                    ? `Certified by ${resolvedIdentity.certifier.name}`
                    : 'Unknown Certifier!', placement: "right", children: (0, jsx_runtime_1.jsx)(material_1.Badge, { overlap: "circular", anchorOrigin: { vertical: 'bottom', horizontal: 'right' }, badgeContent: (0, jsx_runtime_1.jsx)(material_1.Icon, { style: {
                            width: '20px',
                            height: '20px',
                            backgroundColor: 'white',
                            borderRadius: '20%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }, children: (0, jsx_runtime_1.jsx)(uhrp_react_1.Img, { style: { width: '95%', height: '95%', objectFit: 'cover', borderRadius: '20%' }, src: resolvedIdentity.certifier
                                ? resolvedIdentity.certifier.icon
                                : 'https://cdn4.iconfinder.com/data/icons/political-elections/50/48-512.png', confederacyHost: confederacyHost, loading: undefined }) }), children: (0, jsx_runtime_1.jsx)(material_1.Avatar, { alt: resolvedIdentity.name, sx: { width: '2.5em', height: '2.5em' }, children: (0, jsx_runtime_1.jsx)(uhrp_react_1.Img, { style: { width: '100%', height: 'auto' }, src: resolvedIdentity.profilePhoto, confederacyHost: confederacyHost, loading: undefined }) }) }) }), (0, jsx_runtime_1.jsxs)(material_1.CardContent, { sx: {
                    flex: '1 0 auto',
                    padding: '8px !important',
                    '&:last-child': { paddingBottom: '8px !important' }
                }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h6", component: "div", fontSize: '1em', color: themeMode === 'light' ? 'black' : 'white', children: resolvedIdentity.name }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body2", color: themeMode === 'light' ? 'lightGray' : 'darkGray', children: identityKey ? identityKey.slice(0, 10) : (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}) })] })] }));
};
exports.default = IdentityCard;
//# sourceMappingURL=IdentityCard.js.map