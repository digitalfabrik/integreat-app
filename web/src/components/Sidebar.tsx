import CloseIcon from '@mui/icons-material/Close'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Drawer, { drawerClasses } from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import React, { ReactElement, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import useDimensions from '../hooks/useDimensions'
import useLockedBody from '../hooks/useLockedBody'
import { LAYOUT_ELEMENT_ID } from './Layout'

const StyledDrawer = styled(Drawer)`
  .${drawerClasses.paper} {
    width: 400px;

    ${props => props.theme.breakpoints.down('sm')} {
      width: 100%;
    }
  }
`

const Header = styled(Paper)`
  position: fixed;
  width: inherit;

  /* Position header above sidebar content */
  z-index: 1;
`

type SidebarProps = {
  children: ReactNode
  open: boolean
  setOpen: (show: boolean) => void
  Footer?: ReactNode
  OpenButton?: ReactElement
}

const Sidebar = ({ children, open, setOpen, Footer, OpenButton }: SidebarProps): ReactElement | null => {
  const { headerHeight } = useDimensions()
  const { t } = useTranslation('layout')
  useLockedBody(open)

  // This is necessary to ensure the theme is correctly applied to the drawer content
  const drawerContainer = document.getElementById(LAYOUT_ELEMENT_ID)

  return (
    <>
      {OpenButton ?? (
        <IconButton onClick={() => setOpen(true)} aria-label={t('sideBarOpenAriaLabel')} aria-expanded={open}>
          <MoreVertIcon />
        </IconButton>
      )}
      <StyledDrawer
        open={open}
        onClose={() => setOpen(false)}
        container={drawerContainer}
        anchor='right'
        // Locking scroll causes the headroom to disappear when opening the drawer if scrolled down
        disableScrollLock
        // Restoring focus when closing the drawer to a sticky element (headroom) scrolls the content to the top
        disableRestoreFocus>
        <Header>
          <Stack minHeight={headerHeight} justifyContent='center' alignItems='flex-end' paddingInline={1}>
            <IconButton onClick={() => setOpen(false)} aria-label={t('sideBarCloseAriaLabel')}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </Header>
        <Stack marginTop={`${headerHeight}px`} padding={2} height='100%'>
          {children}
        </Stack>
        {Footer}
      </StyledDrawer>
    </>
  )
}

export default Sidebar
