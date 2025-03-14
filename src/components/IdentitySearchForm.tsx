import React, { useState } from 'react'
import { Button, Grid } from '@mui/material'
import SearchField from './SearchField'
import { IdentityClient } from '@bsv/sdk'

interface FieldConfig {
  key: string
  label: string
}

interface SearchFormProps {
  fields: FieldConfig[]
  onSubmit: (data: object[]) => void
}

const SearchForm: React.FC<SearchFormProps> = ({ fields, onSubmit }) => {
  const [formData, setFormData] = useState<Record<string, string>>({})

  const handleChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async () => {
    const identityClient = new IdentityClient()
    const results = await identityClient.resolveByAttributes({
      attributes: formData
    })
    // Send back the results to the user
    onSubmit(results)
  }

  return (
    <form noValidate autoComplete="off">
      <Grid container spacing={2}>
        {fields.map(field => (
          <Grid item xs={12} sm={6} key={field.key}>
            <SearchField
              label={field.label}
              value={formData[field.key] || ''}
              onChange={value => handleChange(field.key, value)}
            />
          </Grid>
        ))}
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Search
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}

export default SearchForm
