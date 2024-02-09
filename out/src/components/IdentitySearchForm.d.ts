import React from 'react';
interface FieldConfig {
    key: string;
    label: string;
}
interface SearchFormProps {
    fields: FieldConfig[];
    onSubmit: (data: object[]) => void;
}
declare const SearchForm: React.FC<SearchFormProps>;
export default SearchForm;
//# sourceMappingURL=IdentitySearchForm.d.ts.map