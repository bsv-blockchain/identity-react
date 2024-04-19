import { Avatar, Badge, Box, CardContent, Icon, Tooltip, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { discoverByIdentityKey } from '@babbage/sdk-ts'
import { Img } from 'uhrp-react'
import { Identity, IdentityProps, SigniaResult } from '../types/metanet-identity-types'
import PhoneIcon from '@mui/icons-material/Phone'
import EmailIcon from '@mui/icons-material/Email'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import XIcon from '@mui/icons-material/X';
import { getCertifierToolTip, knownCertificateTypes } from '../utils/identityUtils'

// TODO: move to helper
export const getIconForType = (certificateType) => {
  switch (certificateType) {
    case knownCertificateTypes.phoneCert:
      return <PhoneIcon style={{ fontSize: 40 }} />;
    case knownCertificateTypes.emailCert:
      return <EmailIcon style={{ fontSize: 40 }} />;
    case knownCertificateTypes.xCert:
      return <XIcon style={{ fontSize: 40 }} />;
    // Add other cases as needed
    default:
      return <AccountCircleIcon style={{ fontSize: 40 }} />; // Default icon
  }
}

const IdentityCard: React.FC<IdentityProps> = ({
  identityKey,
  confederacyHost = 'https://confederacy.babbage.systems',
  themeMode = 'light'
}) => {
  const [resolvedIdentity, setResolvedIdentity] = useState({
    name: 'Stranger',
    profilePhoto: 'https://cdn4.iconfinder.com/data/icons/political-elections/50/48-512.png'
  } as Identity)
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

          // Figure out what information we have available to display
          const { userName, email, phoneNumber, firstName, lastName } = selectedIdentity.decryptedFields
          const name = firstName && lastName ? `${firstName} ${lastName}`
            : userName || email || phoneNumber || 'Unsupported Name';

          setResolvedIdentity({
            name,
            profilePhoto: selectedIdentity.decryptedFields.profilePhoto,
            identityKey: selectedIdentity.subject,
            certifier: selectedIdentity.certifier,
            certificateType: selectedIdentity.type
          })
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
          resolvedIdentity.certifier && resolvedIdentity.certificateType
            ? getCertifierToolTip(resolvedIdentity.certifier, resolvedIdentity.certificateType)
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
                style={{ width: '95%', height: '95%', objectFit: 'cover', borderRadius: '20%' }}
                src={
                  resolvedIdentity.certifier
                    ? resolvedIdentity.certifier.icon
                    : 'https://cdn4.iconfinder.com/data/icons/political-elections/50/48-512.png'
                }
                confederacyHost={confederacyHost}
                loading={undefined}
              />
            </Icon>
          }
        >
          <Avatar alt={resolvedIdentity.name} sx={{ width: '2.5em', height: '2.5em' }}>
            {resolvedIdentity.profilePhoto && !resolvedIdentity.profilePhoto.includes('null') ? (
              <Img
                style={{ width: '100%', height: 'auto' }}
                src={resolvedIdentity.profilePhoto}
                confederacyHost={confederacyHost}
                loading={undefined}
              />
            ) : (
              getIconForType(resolvedIdentity.certificateType)
            )}
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
