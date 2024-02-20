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
const isIdentityKey = (key) => {
    const regex = /^(02|03|04)[0-9a-fA-F]{64}$/;
    return regex.test(key);
};
exports.useStore = (0, zustand_1.create)((set) => ({
    identities: [],
    fetchIdentities: debounce(async (query, setIsLoading) => {
        console.log('is it fetching...?');
        setIsLoading(true);
        let results;
        // Figure out if the query is by IdentityKey
        if (isIdentityKey(query)) {
            results = await (0, sdk_ts_1.discoverByIdentityKey)({
                identityKey: query,
                description: 'Discover MetaNet Identity'
            });
        }
        else {
            results = await (0, sdk_ts_1.discoverByAttributes)({
                attributes: {
                    any: query
                },
                description: 'Discover MetaNet Identity'
            });
            // TODO: Create better solution!
            // Quick Hack to check discord handles
            if (results.length === 0) {
                results = await (0, sdk_ts_1.discoverByAttributes)({
                    attributes: {
                        userName: query
                    },
                    description: 'Discover MetaNet Identity'
                });
            }
        }
        const matchingIdentities = results.map((x) => {
            // Test adding varied name props
            const nameParts = [];
            for (const key in x.decryptedFields) {
                if (key === 'profilePhoto') {
                    continue;
                }
                nameParts.push(x.decryptedFields[key]);
            }
            return {
                name: nameParts.join(' '),
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