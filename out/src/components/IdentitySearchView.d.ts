import React from 'react';
interface FieldConfig {
    key: string;
    label: string;
}
interface SearchFormProps {
    fields: FieldConfig[];
    onSubmit: (data: Record<string, string>) => void;
}
declare const SearchForm: React.FC<SearchFormProps>;
export default SearchForm;
//# sourceMappingURL=IdentitySearchView.d.ts.map