"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStore = void 0;
const zustand_1 = require("zustand");
const sdk_ts_1 = require("@babbage/sdk-ts");
function debounce(func, waitFor) {
    let timeoutId = null;
    return function (...args) {
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => func(...args), waitFor);
    };
}
exports.useStore = (0, zustand_1.create)((set) => ({
    identities: [],
    fetchIdentities: debounce(async (query, setIsLoading) => {
        console.log('is it fetching...?');
        setIsLoading(true);
        const results = await (0, sdk_ts_1.discoverByAttributes)({
            attributes: { firstName: query },
            description: 'Discover MetaNet Identity'
        });
        const matchingIdentities = results.map((x) => {
            return {
                name: x.decryptedFields.firstName,
                profilePhoto: x.decryptedFields.profilePhoto,
                identityKey: x.subject,
                certifier: x.certifier
            };
        });
        console.log(matchingIdentities);
        setIsLoading(false);
        set({ identities: matchingIdentities });
    }, 500),
}));
//# sourceMappingURL=store.js.map