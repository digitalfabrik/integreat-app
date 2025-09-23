import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { StyledText } from './PoiListItem'
import Link from './base/Link'

type LicenseItemProps = {
  name: string
  version: string | undefined
  license: string
  licenseUrl: string
}

const LicenseItem = ({ license, name, licenseUrl, version }: LicenseItemProps): ReactElement => {
  const { t } = useTranslation('licenses')
  return (
    <ListItem disablePadding>
      <ListItemButton aria-label={name} to={licenseUrl} component={Link}>
        <ListItemText
          slotProps={{ secondary: { component: 'div' } }}
          primary={
            <Typography variant='title2' component='h2'>
              {name}
            </Typography>
          }
          secondary={
            <>
              <StyledText>
                {t('version')} {version}
              </StyledText>
              <StyledText>
                {t('license')} {license}
              </StyledText>
            </>
          }
        />
      </ListItemButton>
    </ListItem>
  )
}

export default LicenseItem
