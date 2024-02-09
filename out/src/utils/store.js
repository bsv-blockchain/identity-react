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
const parseAndConstructQuery = (input) => {
    const query = {};
    // Regular expressions for different patterns
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
    const discordPattern = /^[a-zA-Z0-9]+$/;
    if (emailPattern.test(input)) {
        query.email = input;
    }
    else if (phonePattern.test(input)) {
        query.phone = input;
    }
    else if (discordPattern.test(input) && input.includes('#')) {
        query.username = input;
    }
    else {
        // Split input by spaces to check for first/last names
        const names = input.split(' ');
        if (names.length > 1) {
            query.firstName = names[0];
            query.lastName = names.slice(1).join(' ');
        }
        else {
            query.firstName = input; // Default to first name
        }
    }
    return query;
};
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
            const queryToSearch = parseAndConstructQuery(query);
            results = await (0, sdk_ts_1.discoverByAttributes)({
                attributes: queryToSearch,
                description: 'Discover MetaNet Identity'
            });
        }
        const matchingIdentities = results.map((x) => {
            return {
                name: `${x.decryptedFields.firstName} ${x.decryptedFields.lastName}`,
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