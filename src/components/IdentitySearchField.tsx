import React, {
  memo,
  useCallback,
  useMemo,
  useState
} from 'react'
import {
  Autocomplete,
  Avatar,
  Badge,
  Box,
  IconButton,
  LinearProgress,
  ListItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import { Theme, useTheme } from '@mui/material/styles'
import SearchIcon from '@mui/icons-material/Search'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import useAsyncEffect from 'use-async-effect'
import { NoMncModal } from 'metanet-react-prompt'
import { defaultIdentity, DisplayableIdentity } from '@bsv/sdk'
import { Img } from '@bsv/uhrp-react'
import { isIdentityKey } from '../utils/identityUtils'
import { useStore } from '../utils/store'

// Create a global event system without causing re-renders in React components
const copyEvents = {
  listeners: [] as Array<() => void>,
  subscribe: (listener: () => void): (() => void) => {
    copyEvents.listeners.push(listener)
    return () => {
      copyEvents.listeners = copyEvents.listeners.filter(l => l !== listener)
    }
  },
  emit: () => {
    copyEvents.listeners.forEach(listener => listener())
  }
}

// Standalone component for showing toast notifications that won't cause parent re-renders
const CopyNotificationManager = () => {
  const [open, setOpen] = useState(false)
  React.useEffect(() => copyEvents.subscribe(() => setOpen(true)), [])

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={() => setOpen(false)}
      message="Identity key copied to clipboard"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      ContentProps={{ role: 'status', 'aria-live': 'polite' }}
    />
  )
}

export interface IdentitySearchFieldProps {
  /** Override theme, otherwise inherits from MUI context */
  theme?: Theme
  /** Font family for the entire search box */
  font?: string
  /** Callback invoked when an identity is chosen */
  onIdentitySelected?: (selectedIdentity: DisplayableIdentity) => void
  /** Name used in the MNC missing dialog */
  appName?: string
  /** Width of the autocomplete */
  width?: string
  /** Remove duplicate identityKeys from result list */
  deduplicate?: boolean
}

// Memoized component for individual list items to prevent re-rendering the entire list on hover
interface IdentityItemProps {
  option: DisplayableIdentity
  props: React.HTMLAttributes<HTMLLIElement>
}

/**
 * List row for an identity inside the Autocomplete popup.
 * Memoised so only the hovered row re‑renders.
 */
const IdentityItem = memo(({ option, props }: IdentityItemProps) => {
  const [hovered, setHovered] = useState(false)

  const handleCopy = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      navigator.clipboard
        .writeText(option.identityKey)
        .then(copyEvents.emit)
        .catch(err => console.error('Could not copy identity key', err))
    },
    [option.identityKey]
  )

  return (
    <ListItem
      {...props}
      key={option.identityKey}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <ListItemIcon>
        <Tooltip title={option.badgeLabel} placement="right">
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  bgcolor: 'white',
                  borderRadius: '20%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Img
                  src={option.badgeIconURL}
                  style={{ width: '95%', height: '95%', objectFit: 'cover', borderRadius: '20%' }}
                />
              </Box>
            }
          >
            <Avatar>
              <Img src={option.avatarURL} style={{ width: '100%', height: 'auto' }} />
            </Avatar>
          </Badge>
        </Tooltip>
      </ListItemIcon>
      <ListItemText
        primary={<Typography noWrap>{option.name}</Typography>}
        secondary={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {`${option.identityKey.slice(0, 10)}…`}
            </Typography>
            <Tooltip title="Copy identity key">
              <IconButton
                aria-label="Copy identity key"
                size="small"
                sx={{
                  ml: 1,
                  p: 0.5,
                  opacity: hovered ? 1 : 0,
                  visibility: hovered ? 'visible' : 'hidden',
                  transition: 'opacity 0.2s ease-in-out',
                  width: 24,
                  height: 24
                }}
                onClick={handleCopy}
              >
                <ContentCopyIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
          </Box>
        }
      />
    </ListItem>
  )
})

// Main component
const IdentitySearchField: React.FC<IdentitySearchFieldProps> = ({
  theme: themeProp,
  font = '"Roboto Mono", monospace',
  onIdentitySelected,
  appName = 'This app',
  width = '250px',
  deduplicate = true
}) => {
  const theme = themeProp || useTheme()
  const { identities, fetchIdentities } = useStore()

  const [inputValue, setInputValue] = useState('')
  const [selectedIdentity, setSelectedIdentity] = useState(defaultIdentity)
  const [loading, setLoading] = useState(false)
  const [selecting, setSelecting] = useState(false)
  const [mncMissing, setMncMissing] = useState(false)

  // ─────────── Handlers & helpers ───────────
  const handleInputChange = (_: React.SyntheticEvent, val: string) => {
    setInputValue(val)
    setSelecting(false)
    setSelectedIdentity({} as DisplayableIdentity)
  }

  const handleSelect = (_: React.SyntheticEvent, val: DisplayableIdentity | string | null) => {
    if (val && typeof val !== 'string') {
      setSelecting(true)
      setSelectedIdentity(val)
      onIdentitySelected?.(val)
    }
  }

  /** Memoised list filter. Adds a synthetic option when the user types a raw key. */
  const filterOptions = useCallback(
    (opts: DisplayableIdentity[], { inputValue }: { inputValue: string }) => {
      const lower = inputValue.toLowerCase()
      const filtered = opts.filter(
        o => o.name.toLowerCase().includes(lower) || o.identityKey.toLowerCase().includes(lower)
      )
      if (filtered.length === 0 && isIdentityKey(inputValue) && !loading) {
        return [
          {
            ...defaultIdentity,
            name: 'Custom Identity Key',
            identityKey: inputValue
          }
        ]
      }
      return filtered
    },
    [loading]
  )

  /** Memoised unique‑by‑identityKey helper */
  const uniqueOptions = useMemo(() => {
    if (!deduplicate) return identities
    const set = new Set<string>()
    return identities.filter(o => {
      if (set.has(o.identityKey)) return false
      set.add(o.identityKey)
      return true
    })
  }, [identities, deduplicate])

  /** Leading adornment — memoised to avoid re‑creation */
  const adornment = useMemo(() => {
    if (!selectedIdentity.name || selectedIdentity.name === defaultIdentity.name) {
      return <SearchIcon sx={{ color: '#FC433F', mr: 1 }} />
    }
    return (
      <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
        <Img src={selectedIdentity.avatarURL} style={{ width: '100%', height: 'auto' }} />
      </Avatar>
    )
  }, [selectedIdentity])

  // ─────────── Data fetching ───────────
  useAsyncEffect(
    async isMounted => {
      if (!inputValue || selecting) return
      try {
        await fetchIdentities(inputValue, setLoading)
      } catch (err: any) {
        if (err?.code === 'ERR_NO_METANET_IDENTITY') {
          setMncMissing(true)
        } else {
          console.error(err)
        }
      } finally {
        if (isMounted()) setLoading(false)
      }
    },
    [inputValue, selecting]
  )

  // ─────────── Render ───────────
  return (
    <>
      <CopyNotificationManager />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontFamily: font,
          width: '100%',
          p: 2.5
        }}
      >
        <NoMncModal appName={appName} open={mncMissing} onClose={() => setMncMissing(false)} />
        <Box sx={{ position: 'relative', width: 'fit-content', boxShadow: 3 }}>
          <Autocomplete
            freeSolo
            options={uniqueOptions}
            inputValue={inputValue}
            onInputChange={handleInputChange}
            onChange={handleSelect}
            getOptionLabel={o => (typeof o === 'string' ? o : o.name)}
            filterOptions={filterOptions}
            PaperComponent={({ children }) => (
              <Box
                sx={{
                  bgcolor: theme?.palette.background.paper,
                  color: theme?.palette.text.primary,
                  '& ul': { p: 0 }
                }}
              >
                {children}
              </Box>
            )}
            renderOption={(props, option: DisplayableIdentity) => (
              <IdentityItem key={option.identityKey} option={option} props={props} />
            )}
            renderInput={params => (
              <Box>
                <TextField
                  {...params}
                  label="Search Identity"
                  variant="filled"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: adornment,
                    sx: {
                      color: theme?.palette.text.primary,
                      bgcolor: theme?.palette.mode === 'light' ? 'white' : theme?.palette.grey[900]
                    }
                  }}
                  sx={{
                    '& .MuiFilledInput-underline:after': { borderBottomColor: '#FC433F' }
                  }}
                />
                {loading && (
                  <LinearProgress
                    sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2 }}
                  />
                )}
              </Box>
            )}
            sx={{ width, bgcolor: theme?.palette.background.paper }}
          />
        </Box>
      </Box>
    </>
  )
}

export default IdentitySearchField
