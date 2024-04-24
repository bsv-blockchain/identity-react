import { Avatar, Badge, Box, CardContent, Icon, Tooltip, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { discoverByIdentityKey } from '@babbage/sdk-ts'
import { Img } from 'uhrp-react'
import { IdentityProps, SigniaResult } from '../types/metanet-identity-types'
import { parseIdentity, defaultIdentity } from 'identinator'

const IdentityCard: React.FC<IdentityProps> = ({
  identityKey,
  confederacyHost = 'https://confederacy.babbage.systems',
  themeMode = 'light' // TODO: Resolve theme discrepancy with search component
}) => {
  const [resolvedIdentity, setResolvedIdentity] = useState(defaultIdentity)
  useEffect(() => {
    (async () => {
      try {
        // Resolve a Signia verified identity from a counterparty
        const matchingIdentities = await discoverByIdentityKey({
          identityKey,
          description: 'Resolve identity information from your trusted certifiers.'
        })

        // Select the first result which is the most trusted
        if (matchingIdentities.length > 0) {
          const selectedIdentity = matchingIdentities[0] as SigniaResult
          const parsedIdentity = parseIdentity(selectedIdentity)

          setResolvedIdentity(parsedIdentity)
        }
      } catch (e) {
        console.error(e)
      }
    })()
  }, [identityKey])

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
                src={
                  resolvedIdentity.badgeIconURL
                }
                confederacyHost={confederacyHost}
                loading={undefined}
              />
            </Icon>
          }
        >
          <Avatar alt={resolvedIdentity.name} sx={{ width: '2.5em', height: '2.5em' }}>
            <Img
              style={{ width: '100%', height: 'auto' }}
              src={resolvedIdentity.avatarURL}
              confederacyHost={confederacyHost}
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
          fontSize={'1em'}
          color={themeMode === 'light' ? 'black' : 'white'}
        >
          {resolvedIdentity.name}
        </Typography>
        <Typography variant="body2" color={themeMode === 'light' ? 'lightGray' : 'darkGray'}>
          {identityKey ? identityKey.slice(0, 10) : <></>}
        </Typography>
      </CardContent>
    </Box>
  )
}

export default IdentityCard
