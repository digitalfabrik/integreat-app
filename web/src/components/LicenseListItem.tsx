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

type LicenseListItemProps = {
  name: string
  version: string | undefined
  author: string | undefined
  license: string
  url: string | undefined
}

const LicenseListItem = ({ license, name, url, version, author }: LicenseListItemProps): ReactElement => {
  const { t } = useTranslation()
  const Content = (
    <ListItemText
      slotProps={{ primary: { component: 'h3' }, secondary: { component: 'div' } }}
      primary={name}
      secondary={
        <>
          <StyledParagraph>{author}</StyledParagraph>
          {version && <StyledParagraph>{t($ => $.about.openSource.licenses.version, { version })}</StyledParagraph>}
          <StyledParagraph>{t($ => $.about.openSource.licenses.license, { license })}</StyledParagraph>
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

export default LicenseListItem
