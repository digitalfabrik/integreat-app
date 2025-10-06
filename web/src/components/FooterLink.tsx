import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import Link from './base/Link'

const StyledListItem = styled(ListItem)<{ vertical: boolean }>(({ theme, vertical }) => ({
  width: vertical || theme.dimensions.mobile ? '100%' : 'fit-content',
}))

export type FooterLinkProps = {
  to: string
  text: string
  mode?: 'normal' | 'overlay' | 'sidebar'
}

const FooterLink = ({ to, text, mode = 'normal' }: FooterLinkProps): ReactElement => {
  const { t } = useTranslation(['layout', 'settings'])

  return (
    <StyledListItem key={to} disablePadding vertical={mode === 'sidebar'}>
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
