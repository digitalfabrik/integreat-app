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

export type FooterLinkProps = {
  to: string
  text: string
  mode?: 'normal' | 'overlay' | 'sidebar'
}

const FooterLink = ({ to, text, mode = 'normal' }: FooterLinkProps): ReactElement => {
  const { t } = useTranslation(['layout', 'settings'])

  return (
    <StyledListItem key={to} disablePadding>
      <ListItemButton component={Link} to={to}>
        <ListItemText
          primary={
            <Typography variant={mode === 'overlay' ? 'body3' : 'body2'} textAlign='center'>
              {t(text)}
            </Typography>
          }
        />
      </ListItemButton>
    </StyledListItem>
  )
}

export default FooterLink
