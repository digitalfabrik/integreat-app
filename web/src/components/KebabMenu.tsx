import React, { ReactElement, ReactNode } from 'react'
import styled from 'styled-components'

import { UiDirectionType } from 'translations'

import iconClose from '../assets/IconClose.svg'
import iconKebabMenu from '../assets/IconKebabMenu.svg'
import dimensions from '../constants/dimensions'
import useLockedBody from '../hooks/useLockedBody'
import '../styles/KebabMenu.css'
import Portal from './Portal'

type KebabMenuProps = {
  items: Array<ReactNode>
  direction: UiDirectionType
  show: boolean
  setShow: (show: boolean) => void
  footer: ReactNode
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
  box-shadow: -3px 3px 3px 0 rgba(0, 0, 0, 0.13);
  /* to stop flickering of text in safari */
  -webkit-font-smoothing: antialiased;
  transform-origin: 0% 0%;
  transition: transform 0.5s cubic-bezier(0.77, 0.2, 0.05, 1);
  z-index: 40;
  ${props => (props.direction === 'rtl' ? `left: 0;` : `right:0;`)}
  ${props => (props.direction === 'rtl' ? `transform: translate(-100%, 0);` : `transform: translate(100%, 0);`)}
  ${props => props.show && `opacity: 1;transform: none;`}
  display: flex;
  flex-direction: column;
`

const Icon = styled.img`
  z-index: 50;
  position: relative;
  width: 18px;
  height: 18px;
`

const Overlay = styled.div<{ show: boolean }>`
  position: absolute;
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 30;
  display: ${props => (props.show ? `block` : `none`)};
`

const Heading = styled.div<{ direction: string }>`
  display: flex;
  justify-content: ${props => (props.direction === 'rtl' ? `flex-start` : `flex-end`)};
  background-color: ${props => props.theme.colors.backgroundAccentColor};
  box-shadow: -3px 3px 3px 0 rgba(0, 0, 0, 0.13);
  height: ${dimensions.headerHeightSmall}px;
  padding: 0 8px;
`

const Content = styled.div`
  padding: 0 32px;
`

const ToggleButton = styled.button`
  background-color: transparent;
  border: none;
  /* TODO IGAPP-889 remove this margin after implementing new search icon to fix wrong viewBox of svg */
  margin-top: 6px;
`

const KebabMenu = ({ items, direction, show, setShow, footer }: KebabMenuProps): ReactElement | null => {
  const { locked, setLocked } = useLockedBody(show)

  const onClick = () => {
    setShow(!show)
    setLocked(!locked)
  }

  if (items.length === 0) {
    return null
  }

  return (
    <ToggleContainer>
      <ToggleButton onClick={onClick} data-testid='kebab-menu-button'>
        <Icon src={iconKebabMenu} alt='' />
      </ToggleButton>
      <Portal
        className='kebab-menu'
        show={show}
        style={window.scrollY > 0 ? { top: `${window.scrollY}px` } : undefined}>
        {/* disabled because this is an overlay for backdrop close */}
        {/* eslint-disable-next-line styled-components-a11y/no-static-element-interactions,styled-components-a11y/click-events-have-key-events */}
        <Overlay onClick={onClick} show={show} />
        <List direction={direction} show={show}>
          <Heading direction={direction}>
            <ToggleButton onClick={onClick}>
              <Icon src={iconClose} alt='' />
            </ToggleButton>
          </Heading>
          <Content>{items}</Content>
          {footer}
        </List>
      </Portal>
    </ToggleContainer>
  )
}

export default KebabMenu
