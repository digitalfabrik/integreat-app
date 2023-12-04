import React, { ReactElement, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { UiDirectionType } from 'translations'

import { CloseIcon, MenuIcon } from '../assets'
import dimensions from '../constants/dimensions'
import useLockedBody from '../hooks/useLockedBody'
import '../styles/KebabMenu.css'
import Portal from './Portal'
import Button from './base/Button'
import Icon from './base/Icon'

type KebabMenuProps = {
  items: Array<ReactNode>
  direction: UiDirectionType
  show: boolean
  setShow: (show: boolean) => void
  Footer: ReactNode
}

const ToggleContainer = styled.div`
  display: flex;
  padding: 0 8px;
  z-index: 50;
`

const List = styled.div<{ direction: UiDirectionType; show: boolean }>`
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
  ${props => (props.direction === 'rtl' ? `left: 0;` : `right:0;`)}
  ${props => (props.direction === 'rtl' ? `transform: translate(-100%, 0);` : `transform: translate(100%, 0);`)}
  ${props => props.show && `opacity: 1;transform: none;`}
  display: flex;
  flex-direction: column;
`

const Overlay = styled.div<{ show: boolean }>`
  position: absolute;
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  background-color: rgb(0 0 0 / 50%);
  z-index: 30;
  display: ${props => (props.show ? `block` : `none`)};
`

const Heading = styled.div<{ direction: string }>`
  display: flex;
  justify-content: ${props => (props.direction === 'rtl' ? `flex-start` : `flex-end`)};
  background-color: ${props => props.theme.colors.backgroundAccentColor};
  box-shadow: -3px 3px 3px 0 rgb(0 0 0 / 13%);
  height: ${dimensions.headerHeightSmall}px;
  padding: 0 8px;
`

const Content = styled.div`
  padding: 0 32px;
`

const StyledIcon = styled(Icon)`
  width: 28px;
  height: 28px;
`

const KebabMenu = ({ items, direction, show, setShow, Footer }: KebabMenuProps): ReactElement | null => {
  useLockedBody(show)
  const { t } = useTranslation('layout')

  const onClick = () => {
    setShow(!show)
  }

  if (items.length === 0) {
    return null
  }

  return (
    <ToggleContainer>
      <Button onClick={onClick} ariaLabel={t('sideBarOpenAriaLabel')} aria-expanded={show}>
        <StyledIcon src={MenuIcon} />
      </Button>
      <Portal
        className='kebab-menu'
        show={show}
        style={{
          visibility: show ? 'visible' : 'hidden',
          top: window.scrollY > 0 ? `${window.scrollY}px` : undefined,
        }}>
        {/* disabled because this is an overlay for backdrop close */}
        {/* eslint-disable-next-line styled-components-a11y/no-static-element-interactions,styled-components-a11y/click-events-have-key-events */}
        <Overlay onClick={onClick} show={show} />
        <List direction={direction} show={show}>
          <Heading direction={direction}>
            <Button onClick={onClick} ariaLabel={t('sideBarCloseAriaLabel')}>
              <Icon src={CloseIcon} />
            </Button>
          </Heading>
          <Content>{items}</Content>
          {Footer}
        </List>
      </Portal>
    </ToggleContainer>
  )
}

export default KebabMenu
