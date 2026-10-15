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

type OpenSourceListItemProps = {
  name: string
  version: string | undefined
  author: string | undefined
  license: string
  url: string | undefined
}

const OpenSourceListItem = ({ license, name, url, version, author }: OpenSourceListItemProps): ReactElement => {
  const { t } = useTranslation()
  const Content = (
    <ListItemText
      slotProps={{ primary: { component: 'h2' }, secondary: { component: 'div' } }}
      primary={name}
      secondary={
        <>
          <StyledParagraph>{author}</StyledParagraph>
          {version && <StyledParagraph>{t($ => $.about.openSources.licenses.version, { version })}</StyledParagraph>}
          <StyledParagraph>{t($ => $.about.openSources.licenses.license, { license })}</StyledParagraph>
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

export default OpenSourceListItem
