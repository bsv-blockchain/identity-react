"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_2 = require("react");
const store_1 = require("../utils/store");
const material_1 = require("@mui/material");
const Search_1 = __importDefault(require("@mui/icons-material/Search"));
const uhrp_react_1 = require("uhrp-react");
const IdentitySearchField = ({ backgroundColor = '#FFFFFF', font = '"Roboto Mono", monospace', confederacyHost = 'https://confederacy.babbage.systems', onIdentitySelected = (selectedIdentity) => { } }) => {
    const [inputValue, setInputValue] = (0, react_2.useState)('');
    const { identities, fetchIdentities } = (0, store_1.useStore)();
    const [selectedIdentity, setSelectedIdentity] = (0, react_2.useState)({});
    const [isLoading, setIsLoading] = (0, react_2.useState)(false);
    const [isSelecting, setIsSelecting] = (0, react_2.useState)(false);
    const handleInputChange = (_event, newInputValue) => {
        setInputValue(newInputValue);
        setIsSelecting(false);
        setSelectedIdentity({});
        // TODO: Consider using cached results
        // if (identities.some(identity => 
        //   identity.name.split(' ').some(word => word.toLowerCase().startsWith(newInputValue.toLowerCase()))
        // ) === false) {
        // }
    };
    const handleSelect = (_event, newValue) => {
        if (newValue && typeof newValue !== 'string') {
            setIsSelecting(true);
            setSelectedIdentity(newValue);
            onIdentitySelected(newValue);
        }
    };
    (0, react_2.useEffect)(() => {
        // If inputValue changes and we are not selecting, fetch the identity information
        console.log('rerender...');
        if (inputValue && !isSelecting) {
            fetchIdentities(inputValue, setIsLoading);
        }
    }, [inputValue, isSelecting]);
    return ((0, jsx_runtime_1.jsx)(material_1.Box, { sx: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: font,
            width: '100%',
            padding: '20px'
        }, children: (0, jsx_runtime_1.jsx)(material_1.Box, { sx: {
                position: 'relative',
                width: 'fit-content',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
            }, children: (0, jsx_runtime_1.jsx)(material_1.Autocomplete, { freeSolo: true, options: identities, inputValue: inputValue, onInputChange: handleInputChange, onChange: handleSelect, getOptionLabel: (option) => (typeof option === 'string' ? option : option.name), renderInput: (params) => {
                    return ((0, jsx_runtime_1.jsxs)(material_1.Box, { children: [(0, jsx_runtime_1.jsx)(material_1.TextField, Object.assign({}, params, { label: "Search Identity", variant: "filled", InputProps: Object.assign(Object.assign({}, params.InputProps), { startAdornment: selectedIdentity.profilePhoto ? ((0, jsx_runtime_1.jsx)(material_1.Avatar, { sx: { width: 24, height: 24, marginRight: 1 }, children: (0, jsx_runtime_1.jsx)(uhrp_react_1.Img, { style: { width: '100%', height: 'auto' }, src: selectedIdentity.profilePhoto, confederacyHost: confederacyHost, loading: undefined }) })) : ((0, jsx_runtime_1.jsx)(Search_1.default, { sx: { color: '#FC433F', marginRight: 1 } })), style: { color: 'black' } }), sx: {
                                    '& .MuiOutlinedInput-root': {
                                    // borderRadius: '10px',
                                    },
                                    '& .MuiFilledInput-root': {
                                        backgroundColor: backgroundColor,
                                    }
                                } })), isLoading &&
                                (0, jsx_runtime_1.jsx)(material_1.LinearProgress, { sx: {
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        height: '2px',
                                    } })] }));
                }, PaperComponent: ({ children }) => ((0, jsx_runtime_1.jsx)(material_1.Box, { sx: { backgroundColor: '#FFFFFF', color: 'black', '& ul': { padding: 0 } }, children: children })), renderOption: (props, option) => ((0, react_1.createElement)(material_1.ListItem, Object.assign({}, props, { key: `${option.identityKey}${option.certifier}` }),
                    (0, jsx_runtime_1.jsx)(material_1.ListItemIcon, { children: (0, jsx_runtime_1.jsx)(material_1.Avatar, { children: (0, jsx_runtime_1.jsx)(uhrp_react_1.Img, { style: { width: '100%', height: 'auto' }, src: option.profilePhoto, confederacyHost: confederacyHost, loading: undefined }) }) }),
                    (0, jsx_runtime_1.jsx)(material_1.ListItemText, { primary: option.name, secondary: (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body2", style: { color: 'gray' }, children: `${option.identityKey.slice(0, 10)}...` }) }))), style: { width: 300, backgroundColor: backgroundColor } }) }) }));
};
exports.default = IdentitySearchField;
//# sourceMappingURL=IdentitySearchField.js.map