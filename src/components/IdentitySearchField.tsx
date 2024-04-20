import React, { useState } from 'react'
import { Identity } from '../types/metanet-identity-types'
import { useStore } from '../utils/store'
import { Img } from 'uhrp-react'
import SearchIcon from '@mui/icons-material/Search'
import WarningIcon from '@mui/icons-material/Warning';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import {
  Autocomplete,
  Avatar,
  Badge,
  Box,
  Icon,
  LinearProgress,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import { Theme, useTheme } from '@mui/material/styles'
import useAsyncEffect from 'use-async-effect'
import { NoMncModal } from 'metanet-react-prompt'
import { getIconForType } from './IdentityCard'
import { getCertifierToolTip, isIdentityKey } from '../utils/identityUtils'

export interface IdentitySearchFieldProps {
  theme?: Theme
  font?: string
  confederacyHost?: string
  onIdentitySelected?: (selectedIdentity: Identity) => void,
  appName?: string,
  width?: string
}

const IdentitySearchField: React.FC<IdentitySearchFieldProps> = ({
  theme: themeProp,
  font = '"Roboto Mono", monospace',
  confederacyHost = 'https://confederacy.babbage.systems',
  onIdentitySelected = (selectedIdentity: Identity) => {
    // By default the onIdentitySelected handler will just log the selection.
    console.log('Selected Identity:', selectedIdentity)
  },
  appName = 'This app',
  width = '250px'
}) => {
  // Fallback to the default theme from the context
  const theme = themeProp || useTheme()!
  const [inputValue, setInputValue] = useState('')
  const { identities, fetchIdentities } = useStore()
  const [selectedIdentity, setSelectedIdentity] = useState({} as Identity)
  const [isLoading, setIsLoading] = useState(false)
  const [isSelecting, setIsSelecting] = useState(false)
  const [isMncMissing, setIsMncMissing] = useState(false)

  const handleInputChange = (_event: React.SyntheticEvent, newInputValue: string) => {
    console.log('input changed', newInputValue)
    setInputValue(newInputValue)
    setIsSelecting(false)
    setSelectedIdentity({} as Identity)
  }

  const handleSelect = (_event: React.SyntheticEvent, newValue: Identity | string | null) => {
    if (newValue && typeof newValue !== 'string') {
      setIsSelecting(true)
      setSelectedIdentity(newValue)
      onIdentitySelected(newValue)
    }
  }

  // Configure the filtering options for the AutoComplete component
  const filterOptions = (options: Identity[], { inputValue }: { inputValue: string }) => {
    // Filters users by name or identityKey
    const filtered = options.filter(option =>
      option.name.toLowerCase().includes(inputValue.toLowerCase()) ||
      option.identityKey.toLowerCase().includes(inputValue.toLowerCase())
    );

    if (filtered.length === 0 && isIdentityKey(inputValue) && !isLoading) {
      // Create a new identity with the input as the identity key if no match found
      const newIdentity: Identity = {
        name: 'Custom Identity Key',
        profilePhoto: '',
        identityKey: inputValue,
        certificateType: undefined,
        decryptedFields: undefined,
      };
      return [newIdentity];
    }

    return filtered;
  }

  useAsyncEffect(async () => {
    // If inputValue changes and we are not selecting, fetch the identity information
    try {
      if (inputValue && !isSelecting) {
        await fetchIdentities(inputValue, setIsLoading)
        setIsMncMissing(false)
      }
    } catch (error) {
      setIsLoading(false)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      if (error.code === 'ERR_NO_METANET_IDENTITY') {
        setIsMncMissing(true)
        console.log(error)
      } else {
        // Handle other errors or rethrow them
        console.error(error)
      }
    }
  }, [inputValue, isSelecting])

  const getAdornmentForSearch = () => {
    if (!selectedIdentity.profilePhoto) {
      return <SearchIcon sx={{ color: '#FC433F', marginRight: 1 }} />
    } else if (selectedIdentity.profilePhoto.includes('null')) {
      return <>
        <Avatar sx={{ width: 24, height: 24, marginRight: 1 }}>
          <AccountCircleIcon style={{ fontSize: 40 }} />
        </Avatar>
      </>
    }

    return <>
      <Avatar sx={{ width: 24, height: 24, marginRight: 1 }}>
        <Img
          style={{ width: '100%', height: 'auto' }}
          src={selectedIdentity.profilePhoto}
          confederacyHost={confederacyHost}
          loading={undefined}
        />
      </Avatar>
    </>
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: font,
        width: '100%',
        padding: '20px'
      }}
    >
      <NoMncModal appName={appName} open={isMncMissing} onClose={() => setIsMncMissing(false)} />
      <Box
        sx={{
          position: 'relative',
          width: 'fit-content',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
        }}
      >
        <Autocomplete
          freeSolo
          options={identities}
          inputValue={inputValue}
          onInputChange={handleInputChange}
          onChange={handleSelect}
          getOptionLabel={(option) => {
            // Display the name of the identity once selected
            return typeof option === 'string' ? option : option.name
          }}
          filterOptions={filterOptions}
          renderInput={params => {
            return (
              <Box>
                <TextField
                  {...params}
                  label="Search Identity"
                  variant="filled"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: getAdornmentForSearch(),
                    style: {
                      color:
                        theme.palette.mode === 'light'
                          ? theme.palette.common.black
                          : theme.palette.common.white
                    }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      // borderRadius: '10px',
                    },
                    '& .MuiFilledInput-root': {
                      backgroundColor:
                        theme.palette.mode === 'light'
                          ? theme.palette.common.white
                          : theme.palette.grey[900]
                    },
                    '& label': {
                      // Normal state
                      color:
                        theme.palette.mode === 'light'
                          ? theme.palette.common.black
                          : theme.palette.common.white
                    },
                    '& label.Mui-focused': {
                      // Focused state
                      color:
                        theme.palette.mode === 'light'
                          ? theme.palette.common.black
                          : theme.palette.common.white
                    },
                    '& .MuiFilledInput-underline:after': {
                      borderBottomColor: '#FC433F' // your desired color here
                    }
                  }}
                />
                {isLoading && (
                  <LinearProgress
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#FC433F' // your desired solid color
                      }
                    }}
                  />
                )}
              </Box>
            )
          }}
          PaperComponent={({ children }) => (
            <Box
              sx={{
                backgroundColor:
                  theme.palette.mode === 'light'
                    ? theme.palette.common.white
                    : theme.palette.grey[900],
                color:
                  theme.palette.mode === 'light'
                    ? theme.palette.common.black
                    : theme.palette.common.white,
                '& ul': { padding: 0 }
              }}
            >
              {children}
            </Box>
          )}
          renderOption={(props, option: Identity) => {
            return (
              <ListItem {...props} key={`${option.identityKey}${option.certifier ? option.certifier.publicKey : option.name}`}>
                <ListItemIcon>
                  <Tooltip
                    title={
                      option.certifier && option.certificateType
                        ? getCertifierToolTip(option.certifier, option.certificateType)
                        : 'Unknown Certifier!'
                    }
                    placement="right"
                  >
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={
                        <Icon
                          style={{
                            width: '20px',
                            height: '20px',
                            backgroundColor: 'white',
                            borderRadius: '20%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {option.certifier ?
                            <Img
                              style={{
                                width: '95%',
                                height: '95%',
                                objectFit: 'cover',
                                borderRadius: '20%'
                              }}
                              src={option.certifier.icon}
                              confederacyHost={confederacyHost}
                              loading={undefined}
                            />
                            :
                            <WarningIcon />
                          }

                        </Icon>
                      }
                    >
                      <Avatar>
                        {(option.profilePhoto && option.profilePhoto !== '' && !option.profilePhoto.includes('null')) ? (
                          <Img
                            style={{ width: '100%', height: 'auto' }}
                            src={option.profilePhoto}
                            confederacyHost={confederacyHost}
                            loading={undefined}
                          />
                        ) : (
                          getIconForType(option.certificateType)
                        )}
                      </Avatar>
                    </Badge>
                  </Tooltip>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography noWrap style={{ maxWidth: 'calc(100% - 5px)' }}>
                      {option.name}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" style={{ color: 'gray' }}>
                      {`${option.identityKey.slice(0, 10)}...`}
                    </Typography>
                  }
                />
              </ListItem>
            )
          }}
          style={{
            width,
            backgroundColor:
              theme.palette.mode === 'light' ? theme.palette.common.white : theme.palette.grey[900]
          }}
        />
      </Box>
    </Box>
  )
}

export default IdentitySearchField
