import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import Link from './base/Link'

const StyledListItem = styled(ListItem)({
  width: 'fit-content',
})

export type FooterLinkProps = {
  to: string
  text: string
}

const FooterListItem = ({ to, text }: FooterLinkProps): ReactElement => {
  const { t } = useTranslation(['layout', 'settings'])

  return (
    <StyledListItem key={to} disablePadding>
      <ListItemButton component={Link} to={to}>
        <ListItemText
          primary={
            <Typography variant='body2' textAlign='center'>
              {t(text)}
            </Typography>
          }
        />
      </ListItemButton>
    </StyledListItem>
  )
}

export default FooterListItem
