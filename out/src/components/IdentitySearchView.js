"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
// SearchForm.tsx
const react_1 = require("react");
const material_1 = require("@mui/material");
const SearchField_1 = __importDefault(require("./SearchField"));
const SearchForm = ({ fields, onSubmit }) => {
    const [formData, setFormData] = (0, react_1.useState)({});
    const handleChange = (key, value) => {
        setFormData((prev) => (Object.assign(Object.assign({}, prev), { [key]: value })));
    };
    const handleSubmit = () => {
        onSubmit(formData);
    };
    return ((0, jsx_runtime_1.jsx)("form", { noValidate: true, autoComplete: "off", children: (0, jsx_runtime_1.jsxs)(material_1.Grid, { container: true, spacing: 2, children: [fields.map((field) => ((0, jsx_runtime_1.jsx)(material_1.Grid, { item: true, xs: 12, sm: 6, children: (0, jsx_runtime_1.jsx)(SearchField_1.default, { label: field.label, value: formData[field.key] || '', onChange: (value) => handleChange(field.key, value) }) }, field.key))), (0, jsx_runtime_1.jsx)(material_1.Grid, { item: true, xs: 12, children: (0, jsx_runtime_1.jsx)(material_1.Button, { variant: "contained", color: "primary", onClick: handleSubmit, children: "Search" }) })] }) }));
};
exports.default = SearchForm;
//# sourceMappingURL=IdentitySearchView.js.map