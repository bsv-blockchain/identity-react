import { Avatar, Badge, Box, CardContent, Icon, IconButton, Snackbar, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { IdentityProps } from '../types';
import { defaultIdentity, IdentityClient, DisplayableIdentity } from '@bsv/sdk';
import { Img } from '@bsv/uhrp-react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

// Create an IdentityClient instance
const identityClient = new IdentityClient();

// Lightweight cache for resolved identities (shared across all component instances)
const identityCache = new Map<string, { identity: DisplayableIdentity; timestamp: number }>();
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

const IdentityCard: React.FC<IdentityProps> = ({
  identityKey,
  themeMode = 'light'
}) => {
  const [resolvedIdentity, setResolvedIdentity] = useState(defaultIdentity);
  const [copySnackbarOpen, setCopySnackbarOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const handleCopyIdentityKey = () => {
    if (identityKey) {
      navigator.clipboard.writeText(identityKey)
        .then(() => setCopySnackbarOpen(true))
        .catch(err => console.error('Could not copy identity key:', err))
    }
  };

  useEffect(() => {
    if (!identityKey) {
      setResolvedIdentity(defaultIdentity);
      return;
    }

    (async () => {
      try {
        // Check cache first
        const cached = identityCache.get(identityKey);
        if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY) {
          setResolvedIdentity(cached.identity);
          return;
        }

        // Fetch identities using the IdentityClient
        const matchingIdentities = await identityClient.resolveByIdentityKey({
          identityKey
        });

        // Select the first result (most relevant/trusted)
        if (matchingIdentities.length > 0) {
          const resolvedId = matchingIdentities[0];
          setResolvedIdentity(resolvedId);

          // Cache the result
          identityCache.set(identityKey, {
            identity: resolvedId,
            timestamp: Date.now()
          });
        }
      } catch (e) {
        console.error('Failed to resolve identity:', e);
      }
    })();
  }, [identityKey]);

  return (
    <React.Fragment>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          borderRadius: '16px',
          padding: '0.2em 0.4em 0.2em 0.5em',
          maxWidth: 345,
          border: 'none',
          backgroundColor: 'transparent'
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <Tooltip
          title={
            resolvedIdentity.badgeLabel
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
                  style={{ width: '95%', height: '95%', objectFit: 'cover', borderRadius: '20%' }}
                  src={resolvedIdentity.badgeIconURL}
                  loading={undefined}
                />
              </Icon>
            }
          >
            <Avatar alt={resolvedIdentity.name} sx={{ width: '2.5em', height: '2.5em' }}>
              <Img
                style={{ width: '100%', height: 'auto' }}
                src={resolvedIdentity.avatarURL}
                loading={undefined}
              />
            </Avatar>
          </Badge>
        </Tooltip>
        <CardContent
          sx={{
            flex: '1 0 auto',
            padding: '8px !important',
            '&:last-child': { paddingBottom: '8px !important' }
          }}
        >
          <Typography
            variant="h6"
            component="div"
            fontSize="1em"
            color={themeMode === 'light' ? 'black' : 'white'}
          >
            {resolvedIdentity.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" color={themeMode === 'light' ? 'lightGray' : 'darkGray'}>
              {identityKey ? identityKey.slice(0, 10) + '...' : <></>}
            </Typography>
            {identityKey && (
              <Tooltip title="Copy identity key">
                <IconButton
                  size="small"
                  sx={{
                    ml: 1,
                    p: 0.5,
                    opacity: isHovering ? 1 : 0,
                    visibility: isHovering ? 'visible' : 'hidden',
                    transition: 'opacity 0.2s ease-in-out',
                    // Reserve space even when button is hidden
                    width: '24px',
                    height: '24px',
                  }}
                  onClick={handleCopyIdentityKey}
                >
                  <ContentCopyIcon fontSize="small" sx={{ color: themeMode === 'light' ? 'lightGray' : 'darkGray', fontSize: '0.9rem' }} />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </CardContent>
      </Box>
      <Snackbar
        open={copySnackbarOpen}
        autoHideDuration={3000}
        onClose={() => setCopySnackbarOpen(false)}
        message="Identity key copied to clipboard"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </React.Fragment>
  );
};

export default IdentityCard;
