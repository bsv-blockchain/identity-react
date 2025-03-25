import { Avatar, Badge, Box, CardContent, Icon, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { IdentityProps } from '../types/metanet-identity-types';
import { defaultIdentity, IdentityClient } from '@bsv/sdk';
import { Img } from '@bsv/uhrp-react';

// Create an IdentityClient instance
const identityClient = new IdentityClient();

const IdentityCard: React.FC<IdentityProps> = ({
  identityKey,
  themeMode = 'light'
}) => {
  const [resolvedIdentity, setResolvedIdentity] = useState(defaultIdentity);

  useEffect(() => {
    (async () => {
      try {
        // Fetch identities using the IdentityClient
        const matchingIdentities = await identityClient.resolveByIdentityKey({
          identityKey
        })

        // Select the first result (most relevant/trusted)
        if (matchingIdentities.length > 0) {
          setResolvedIdentity(matchingIdentities[0]) // zeroth?
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, [identityKey]);

  return (
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
        <Typography variant="body2" color={themeMode === 'light' ? 'lightGray' : 'darkGray'}>
          {identityKey ? identityKey.slice(0, 10) : <></>}
        </Typography>
      </CardContent>
    </Box>
  );
};

export default IdentityCard;
