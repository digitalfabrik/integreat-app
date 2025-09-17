import CloseIcon from '@mui/icons-material/Close'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import React, { ReactElement, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import useWindowDimensions from '../hooks/useWindowDimensions'
import { LAYOUT_ELEMENT_ID } from './Layout'

const Content = styled('div')`
  width: calc(100vw - 120px);
  padding: 8px;
`

const Header = styled(Stack)`
  align-items: flex-end;
  justify-content: center;
  padding: 0 8px;
`

type SidebarProps = {
  children: ReactNode
  open: boolean
  setOpen: (show: boolean) => void
  Footer?: ReactNode
  OpenButton?: ReactElement
}

const Sidebar = ({ children, open, setOpen, Footer, OpenButton }: SidebarProps): ReactElement | null => {
  const { t } = useTranslation('layout')
  const { headerHeight } = useWindowDimensions()

  // This is necessary to ensure the theme is correctly applied to the drawer content
  const drawerContainer = document.getElementById(LAYOUT_ELEMENT_ID)

  return (
    <>
      {OpenButton ?? (
        <IconButton onClick={() => setOpen(true)} aria-label={t('sideBarOpenAriaLabel')} aria-expanded={open}>
          <MoreVertIcon />
        </IconButton>
      )}
      <Drawer open={open} onClose={() => setOpen(false)} container={drawerContainer} anchor='right'>
        <Paper>
          <Header minHeight={headerHeight}>
            <IconButton onClick={() => setOpen(false)} aria-label={t('sideBarCloseAriaLabel')}>
              <CloseIcon />
            </IconButton>
          </Header>
        </Paper>
        <Content>{children}</Content>
        {Footer}
      </Drawer>
    </>
  )
}

export default Sidebar
