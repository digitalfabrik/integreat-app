import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'

import useFooterLinks from '../hooks/useFooterLinks'
import Footer from './Footer'
import Link from './base/Link'
import List from './base/List'

const StyledList = styled(List)`
  padding: 0;
`

const StyledListItem = styled(ListItem)`
  width: fit-content;

  ${props => props.theme.breakpoints.down('md')} {
    width: 100%;
  }
`

const SidebarFooterContainer = styled('div')`
  width: 100%;
  margin-top: -10px; /* to counteract the padding-top of the normal footer */
  padding: 0 27px;
`

type CityContentFooterProps = {
  city: string
  language: string
  mode?: 'normal' | 'overlay' | 'sidebar'
}

export type FooterLinkItem = {
  to: string
  text: string
}

export const linkListItems = (linkItems: FooterLinkItem[]): ReactElement[] =>
  linkItems.map(item => {
    const { to, text } = item
    return (
      <StyledListItem key={to} disablePadding>
        <ListItemButton component={Link} to={to}>
          <ListItemText
            primary={
              <Typography variant='body2' textAlign='center'>
                {text}
              </Typography>
            }
          />
        </ListItemButton>
      </StyledListItem>
    )
  })

const CityContentFooter = ({ city, language, mode = 'normal' }: CityContentFooterProps): ReactElement => {
  const linkItems = useFooterLinks({ city, language })

  const LinksList = <StyledList NoItemsMessage='' items={linkListItems(linkItems)} horizontal={mode !== 'sidebar'} />

  if (mode === 'sidebar') {
    return (
      <Footer>
        <SidebarFooterContainer>{LinksList}</SidebarFooterContainer>
      </Footer>
    )
  }

  return <Footer overlay={mode === 'overlay'}>{LinksList}</Footer>
}

export default CityContentFooter
