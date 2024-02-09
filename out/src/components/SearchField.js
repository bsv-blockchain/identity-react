"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const material_1 = require("@mui/material");
const SearchField = ({ label, value, onChange }) => {
    return ((0, jsx_runtime_1.jsx)(material_1.TextField, { fullWidth: true, label: label, value: value, onChange: (e) => onChange(e.target.value), margin: "normal", variant: "outlined" }));
};
exports.default = SearchField;
//# sourceMappingURL=SearchField.js.map