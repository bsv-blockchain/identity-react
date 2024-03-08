"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIdentitySearch = void 0;
const react_1 = require("react");
const react_2 = require("react"); // Switched to useEffect as we're not using async directly in the effect
const store_1 = require("../utils/store");
const useIdentitySearch = ({ confederacyHost = "https://confederacy.babbage.systems", onIdentitySelected = () => { }, } = {}) => {
    const [inputValue, setInputValue] = (0, react_1.useState)("");
    const { identities, fetchIdentities } = (0, store_1.useStore)();
    const [selectedIdentity, setSelectedIdentity] = (0, react_1.useState)(null);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    (0, react_2.useEffect)(() => {
        if (inputValue) {
            fetchIdentities(inputValue, setIsLoading);
        }
    }, [inputValue, fetchIdentities]);
    const handleInputChange = (_, newInputValue) => {
        setInputValue(newInputValue);
    };
    const handleSelect = (_, newValue) => {
        setSelectedIdentity(newValue);
        if (newValue) {
            onIdentitySelected(newValue);
        }
    };
    return {
        confederacyHost,
        inputValue,
        setInputValue: handleInputChange,
        selectedIdentity,
        setSelectedIdentity: handleSelect,
        identities,
        isLoading,
        setIsLoading,
    };
};
exports.useIdentitySearch = useIdentitySearch;
//# sourceMappingURL=useIdentitySearch.js.map