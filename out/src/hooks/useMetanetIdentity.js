"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMetanetIdentity = void 0;
const react_1 = require("react");
// Custom hook definition
const useMetanetIdentity = () => {
    const initialValue = 0;
    const [count, setCount] = (0, react_1.useState)(initialValue);
    const increment = () => setCount(count + 2);
    const decrement = () => setCount(count - 1);
    const reset = () => setCount(initialValue);
    return { count, increment, decrement, reset };
};
exports.useMetanetIdentity = useMetanetIdentity;
//# sourceMappingURL=useMetanetIdentity.js.map