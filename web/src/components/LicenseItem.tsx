import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import Link from './base/Link'

const StyledParagraph = styled('p')`
  margin: 0;
`

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
      <ListItemButton to={licenseUrl} component={Link}>
        <ListItemText
          slotProps={{ primary: { component: 'h2' }, secondary: { component: 'div' } }}
          primary={name}
          secondary={
            <>
              <StyledParagraph>
                {t('version')} {version}
              </StyledParagraph>
              <StyledParagraph>
                {t('license')} {license}
              </StyledParagraph>
            </>
          }
        />
      </ListItemButton>
    </ListItem>
  )
}

export default LicenseItem
