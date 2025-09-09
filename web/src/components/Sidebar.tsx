import CloseIcon from '@mui/icons-material/Close'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import React, { ReactElement, ReactNode, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import useLockedBody from '../hooks/useLockedBody'
import useWindowDimensions from '../hooks/useWindowDimensions'
import Portal from './Portal'

const ToggleContainer = styled('div')`
  z-index: 50;
`

const SidebarContainer = styled('div')`
  font-family: ${props => props.theme.legacy.fonts.web.decorativeFont};
  position: fixed;
  top: 0;
  width: 80vw;
  height: 100vh;
  background-color: ${props => props.theme.legacy.colors.backgroundColor};
  box-shadow: -3px 3px 3px 0 rgb(0 0 0 / 13%);

  /* to stop flickering of text in safari */
  -webkit-font-smoothing: antialiased;
  transform-origin: 0 0;
  transition: transform 0.5s cubic-bezier(0.77, 0.2, 0.05, 1);
  z-index: 40;
  right: 0;
  display: flex;
  flex-direction: column;
`

const Overlay = styled('div')<{ show: boolean }>`
  position: fixed;
  width: 100%;
  height: 100vh;
  top: 0;
  inset-inline-start: 0;
  background-color: rgb(0 0 0 / 50%);
  z-index: 30;
  display: ${props => (props.show ? `block` : `none`)};
`

const Heading = styled('div')<{ headerHeight: number }>`
  display: flex;
  justify-content: flex-end;
  background-color: ${props => props.theme.legacy.colors.backgroundAccentColor};
  min-height: ${props => props.headerHeight}px;
  box-sizing: border-box;
  padding: 8px;
`

const ActionBar = styled('nav')`
  display: flex;
  align-items: center;
`

const Content = styled('div')<{ headerHeight: number }>`
  top: ${props => props.headerHeight}px;
  height: calc(100% - ${props => props.headerHeight}px);
  overflow: hidden auto;
  padding: 0 32px;
`

const StyledIconButton = styled(IconButton)`
  right: 4px;
`

type SidebarProps = {
  children: ReactNode
  show: boolean
  setShow: (show: boolean) => void
  Footer?: ReactNode
  OpenButton?: ReactElement
}

const Sidebar = ({ children, show, setShow, Footer, OpenButton }: SidebarProps): ReactElement | null => {
  useLockedBody(show)
  const { t } = useTranslation('layout')
  const [scrollY, setScrollY] = useState<number>(0)
  const { headerHeight } = useWindowDimensions()

  useLayoutEffect(() => {
    if (show) {
      setScrollY(window.scrollY)
    }
  }, [show])

  return (
    <>
      {OpenButton ?? (
        <ToggleContainer>
          <IconButton onClick={() => setShow(!show)} aria-label={t('sideBarOpenAriaLabel')} aria-expanded={show}>
            <MoreVertIcon />
          </IconButton>
        </ToggleContainer>
      )}
      <Portal
        className='sidebar'
        show={show}
        style={{
          display: show ? 'block' : 'none',
          top: scrollY > 0 ? `${scrollY}px` : undefined,
        }}>
        {/* disabled because this is an overlay for backdrop close */}
        {/* eslint-disable-next-line styled-components-a11y/no-static-element-interactions,styled-components-a11y/click-events-have-key-events */}
        <Overlay onClick={() => setShow(false)} show={show} />
        <SidebarContainer>
          <Heading headerHeight={headerHeight}>
            <ActionBar>
              <StyledIconButton onClick={() => setShow(false)} aria-label={t('sideBarCloseAriaLabel')}>
                <CloseIcon />
              </StyledIconButton>
            </ActionBar>
          </Heading>
          <Content headerHeight={headerHeight}>{children}</Content>
          {Footer}
        </SidebarContainer>
      </Portal>
    </>
  )
}

export default Sidebar
