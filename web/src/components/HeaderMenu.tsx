import MoreVertIcon from '@mui/icons-material/MoreVert'
import { dividerClasses } from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import MuiMenu from '@mui/material/Menu'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { useRouteParams } from '../hooks/useCityContentParams'
import useDimensions from '../hooks/useDimensions'
import { withDividers } from '../utils'
import getFooterLinks from '../utils/getFooterLinks'
import MenuItem from './MenuItem'

const StyledMenu = styled(MuiMenu)({
  marginTop: 8,

  [`& .${dividerClasses.root}`]: {
    margin: '0 8px !important',
  },
})

type HeaderMenuProps = {
  children: ReactElement[] | ReactElement
}

const HeaderMenu = ({ children }: HeaderMenuProps): ReactElement => {
  const [menuAnchorElement, setMenuAnchorElement] = React.useState<HTMLElement | null>(null)
  const { cityCode, languageCode } = useRouteParams()
  const { mobile } = useDimensions()
  const { t } = useTranslation('layout')

  const openMenu = (event: React.MouseEvent<HTMLElement>) => setMenuAnchorElement(event.currentTarget)
  const closeMenu = () => setMenuAnchorElement(null)
  const open = menuAnchorElement !== null

  const legalItems = mobile
    ? getFooterLinks({ languageCode, cityCode }).map(({ text, to }) => <MenuItem key={text} text={t(text)} to={to} />)
    : []

  const items = Array.isArray(children) ? children : [children]

  return (
    <>
      <IconButton onClick={openMenu} aria-label={t('sideBarOpenAriaLabel')} aria-expanded={open}>
        <MoreVertIcon />
      </IconButton>
      <StyledMenu anchorEl={menuAnchorElement} open={open} onClose={closeMenu} onClick={closeMenu}>
        {withDividers([...items, ...legalItems])}
      </StyledMenu>
    </>
  )
}

export default HeaderMenu
