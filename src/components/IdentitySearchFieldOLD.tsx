import React, { useEffect, useState } from 'react'
import { Identity } from '../types/metanet-identity-types'
import { useStore } from '../utils/store'
import { Img } from 'uhrp-react'
import SearchIcon from '@mui/icons-material/Search'
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

export interface IdentitySearchFieldProps {
  theme?: Theme
  font?: string
  confederacyHost?: string
  onIdentitySelected?: (selectedIdentity: Identity) => void,
  appName?: string
}

const IdentitySearchField: React.FC<IdentitySearchFieldProps> = ({
  theme: themeProp,
  font = '"Roboto Mono", monospace',
  confederacyHost = 'https://confederacy.babbage.systems',
  onIdentitySelected = (selectedIdentity: Identity) => { },
  appName = 'This app'
}) => {
  // Fallback to the default theme from the context
  const theme = themeProp || useTheme()!

  const [inputValue, setInputValue] = useState('')
  const { identities, fetchIdentities } = useStore()
  const [selectedIdentity, setSelectedIdentity] = useState({} as Identity)
  const [isLoading, setIsLoading] = useState(false)
  const [isSelecting, setIsSelecting] = useState(false)
  const [isMncMissing, setIsMncMissing] = useState(false) // Added state to control NoMncModal visibility

  const handleInputChange = (_event: React.SyntheticEvent, newInputValue: string) => {
    console.log('input changed')
    setInputValue(newInputValue)
    setIsSelecting(false)
    setSelectedIdentity({} as Identity)

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

  useEffect(()=>{
    console.log(identities)
  },[identities])

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
          getOptionLabel={option => (typeof option === 'string' ? option : option.name)}
          renderInput={params => {
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
                          loading={undefined}
                        />
                      </Avatar>
                    ) : (
                      <SearchIcon sx={{ color: '#FC433F', marginRight: 1 }} />
                    ),
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
              <ListItem {...props} key={`${option.identityKey}${option.certifier.publicKey}`}>
                <ListItemIcon>
                  <Tooltip
                    title={
                      option.certifier
                        ? `Certified by ${option.certifier.name}`
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
                          <Img
                            style={{
                              width: '95%',
                              height: '95%',
                              objectFit: 'cover',
                              borderRadius: '20%'
                            }}
                            src={option.certifier ? option.certifier.icon : ''}
                            confederacyHost={confederacyHost}
                            loading={undefined}
                          />
                        </Icon>
                      }
                    >
                      <Avatar>
                        {option.profilePhoto ? (
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
                  primary={option.name}
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
            minWidth: '300px',
            backgroundColor:
              theme.palette.mode === 'light' ? theme.palette.common.white : theme.palette.grey[900]
          }}
        />
      </Box>
    </Box>
  )
}

export default IdentitySearchField
