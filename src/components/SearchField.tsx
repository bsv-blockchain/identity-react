import React from 'react'
import { TextField } from '@mui/material'

interface SearchFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
}

const SearchField: React.FC<SearchFieldProps> = ({ label, value, onChange }) => {
  return (
    <TextField
      fullWidth
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      margin="normal"
      variant="outlined"
    />
  )
}

export default SearchField