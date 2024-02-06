import React, { useEffect, useState } from 'react'
import { Identity, useStore } from '../utils/store'
import { Autocomplete, TextField, ListItem, ListItemIcon, ListItemText, Avatar, Box, Typography, LinearProgress, Icon, Badge } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { Img } from 'uhrp-react'

export interface IdentitySearchFieldProps {
  backgroundColor?: string
  font?: string
  confederacyHost?: string
  onIdentitySelected?: (selectedIdentity: Identity) => void
}

const IdentitySearchField: React.FC<IdentitySearchFieldProps> = ({
  backgroundColor = '#FFFFFF',
  font = '"Roboto Mono", monospace',
  confederacyHost = 'https://confederacy.babbage.systems',
  onIdentitySelected = (selectedIdentity: Identity) => {}
}) => {
  const [inputValue, setInputValue] = useState('')
  const { identities, fetchIdentities } = useStore()
  const [selectedIdentity, setSelectedIdentity] = useState({} as Identity)
  const [isLoading, setIsLoading] = useState(false)
  const [isSelecting, setIsSelecting] = useState(false)

  const handleInputChange = (_event: React.SyntheticEvent, newInputValue: string) => {
    setInputValue(newInputValue)
    setIsSelecting(false)
    setSelectedIdentity({} as Identity);

    // TODO: Consider using cached results
    // if (identities.some(identity => 
    //   identity.name.split(' ').some(word => word.toLowerCase().startsWith(newInputValue.toLowerCase()))
    // ) === false) {
    // }
  }

  const handleSelect = (_event: React.SyntheticEvent, newValue: Identity | string | null) => {
    if (newValue && typeof newValue !== 'string') {
      setIsSelecting(true)
      setSelectedIdentity(newValue)
      onIdentitySelected(newValue)
    }
  }

  useEffect(() => {
    // If inputValue changes and we are not selecting, fetch the identity information
    console.log('rerender...')
    if (inputValue && !isSelecting) {
      fetchIdentities(inputValue, setIsLoading)
    }
  }, [inputValue, isSelecting])

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: font,
      width: '100%',
      padding: '20px'
    }}>
      <Box sx={{
        position: 'relative',
        width: 'fit-content',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
      }}>
        <Autocomplete
          freeSolo
          options={identities}
          inputValue={inputValue}
          onInputChange={handleInputChange}
          onChange={handleSelect}
          getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
          renderInput={(params) => {
            return (
             <Box>            
              <TextField
                {...params}
                label="Search Identity"
                variant="filled"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: selectedIdentity.profilePhoto ? (
                    <Avatar sx={{ width: 24, height: 24, marginRight: 1 }}>
                        <Img
                      style={{ width: '100%', height: 'auto' }}
                      src={(selectedIdentity as Identity).profilePhoto}
                      confederacyHost={confederacyHost}
                      loading={undefined}                  />
                  </Avatar>
                  ) : (
                    <SearchIcon sx={{ color: '#FC433F', marginRight: 1 }} />
                  ),
                  style: { color: 'black' }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    // borderRadius: '10px',
                  },
                  '& .MuiFilledInput-root': {
                    backgroundColor: backgroundColor,
                  }
                }}
              />
              {isLoading && 
                <LinearProgress
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                  }}
                />
              }
            </Box>
            )}
          }
          PaperComponent={({ children }) => (
            <Box sx={{ backgroundColor: '#FFFFFF', color: 'black', '& ul': { padding: 0 } }}>
              {children}
            </Box>
          )}
          renderOption={(props, option: Identity) => {
            return (
            <ListItem {...props} key={`${option.identityKey}${option.certifier.publicKey}`}>
              <ListItemIcon>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <Icon style={{ width: '20px', height: '20px', backgroundColor: 'white', borderRadius: '20%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Img
                        style={{ width: '95%', height: '95%', objectFit: 'cover', borderRadius: '20%' }}
                        src={option.certifier ? option.certifier.icon : ''}
                        confederacyHost={confederacyHost}
                        loading={undefined}                  
                      />
                    </Icon>
                  }
                >
                  <Avatar>
                    <Img
                      style={{ width: '100%', height: 'auto' }}
                      src={option.profilePhoto}
                      confederacyHost={confederacyHost}
                      loading={undefined}
                    />
                  </Avatar>
                </Badge>
              </ListItemIcon>
              <ListItemText
                primary={option.name}
                secondary={
                  <Typography variant="body2" style={{ color: 'gray' }}>
                    {`${option.identityKey.slice(0, 10)}...`}
                  </Typography>
                }
              />
            </ListItem>
          )}}
          
          style={{ width: 300, backgroundColor: backgroundColor }}
        />
      </Box>
    </Box>
  )
}

export default IdentitySearchField
