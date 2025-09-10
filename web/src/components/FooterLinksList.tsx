import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import Link from './base/Link'

const StyledListItem = styled(ListItem)`
  width: fit-content;

  ${props => props.theme.breakpoints.down('md')} {
    width: 100%;
  }
`

export type FooterLinkItem = {
  to: string
  text: string
  prefix?: string
}

type FooterLinksListProps = {
  linkItems: FooterLinkItem[]
}

const FooterLinksList = ({ linkItems }: FooterLinksListProps): ReactElement[] => {
  const { t } = useTranslation(['layout', 'settings'])

  return linkItems.map(item => (
    <StyledListItem key={item.to} disablePadding>
      <ListItemButton component={Link} to={item.to}>
        <ListItemText
          primary={
            <Typography variant='body2' textAlign='center'>
              {t(item.text, item.prefix ? { appName: item.prefix } : undefined)}
            </Typography>
          }
        />
      </ListItemButton>
    </StyledListItem>
  ))
}

export default FooterLinksList
