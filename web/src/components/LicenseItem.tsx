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
  publisher: string | undefined
  license: string
  url: string | undefined
}

const LicenseItem = ({ license, name, url, version, publisher }: LicenseItemProps): ReactElement => {
  const { t } = useTranslation('licenses')
  const Content = (
    <ListItemText
      slotProps={{ primary: { component: 'h2' }, secondary: { component: 'div' } }}
      primary={name}
      secondary={
        <>
          <StyledParagraph>{publisher}</StyledParagraph>
          <StyledParagraph>
            {t('version')} {version}
          </StyledParagraph>
          <StyledParagraph>
            {t('license')} {license}
          </StyledParagraph>
        </>
      }
    />
  )
  return (
    <ListItem disablePadding>
      {url ? (
        <ListItemButton to={url} component={Link}>
          {Content}
        </ListItemButton>
      ) : (
        Content
      )}
    </ListItem>
  )
}

export default LicenseItem
