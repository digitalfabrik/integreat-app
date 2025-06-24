import styled from '@emotion/styled'
import React, { ReactElement, ReactNode, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { CloseIcon, MenuIcon } from '../assets'
import dimensions from '../constants/dimensions'
import useLockedBody from '../hooks/useLockedBody'
import Portal from './Portal'
import Button from './base/Button'
import Icon from './base/Icon'

type KebabMenuProps = {
  items: ReactNode[]
  show: boolean
  setShow: (show: boolean) => void
  Footer: ReactNode
}

const ToggleContainer = styled.div`
  display: flex;
  padding: 0 8px;
  z-index: 50;
`

const List = styled.div`
  font-family: ${props => props.theme.fonts.web.decorativeFont};
  position: absolute;
  top: 0;
  width: 80vw;
  height: 100vh;
  background-color: ${props => props.theme.colors.backgroundColor};
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

const Overlay = styled.div<{ show: boolean }>`
  position: absolute;
  width: 100%;
  height: 100vh;
  top: 0;
  inset-inline-start: 0;
  background-color: rgb(0 0 0 / 50%);
  z-index: 30;
  display: ${props => (props.show ? `block` : `none`)};
`

const Heading = styled.div`
  display: flex;
  justify-content: flex-end;
  background-color: ${props => props.theme.colors.backgroundAccentColor};
  box-shadow: -3px 3px 3px 0 rgb(0 0 0 / 13%);
  min-height: ${dimensions.headerHeightSmall}px;
  box-sizing: border-box;
  padding: 8px;
`

const ActionBar = styled.nav`
  display: flex;
  align-items: center;
  padding: 0 16px;
`

const Content = styled.div`
  padding: 0 32px;
`

const StyledIcon = styled(Icon)`
  width: 28px;
  height: 28px;
`

const KebabMenu = ({ items, show, setShow, Footer }: KebabMenuProps): ReactElement | null => {
  useLockedBody(show)
  const { t } = useTranslation('layout')
  const [scrollY, setScrollY] = useState<number>(0)

  useLayoutEffect(() => {
    if (show) {
      setScrollY(window.scrollY)
    }
  }, [show])

  const onClick = () => {
    setShow(!show)
  }

  if (items.length === 0) {
    return null
  }

  return (
    <ToggleContainer>
      <Button onClick={onClick} label={t('sideBarOpenAriaLabel')} aria-expanded={show}>
        <StyledIcon src={MenuIcon} />
      </Button>
      <Portal
        className='kebab-menu'
        show={show}
        style={{
          display: show ? 'block' : 'none',
          top: scrollY > 0 ? `${scrollY}px` : undefined,
        }}>
        {/* disabled because this is an overlay for backdrop close */}
        {/* eslint-disable-next-line styled-components-a11y/no-static-element-interactions,styled-components-a11y/click-events-have-key-events */}
        <Overlay onClick={onClick} show={show} />
        <List>
          <Heading>
            <ActionBar>
              <Button onClick={onClick} label={t('sideBarCloseAriaLabel')}>
                <Icon src={CloseIcon} />
              </Button>
            </ActionBar>
          </Heading>
          <Content>{items}</Content>
          {Footer}
        </List>
      </Portal>
    </ToggleContainer>
  )
}

export default KebabMenu
