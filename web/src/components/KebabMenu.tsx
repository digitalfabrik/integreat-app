import React, { ReactElement, ReactNode, useState } from 'react'
import styled from 'styled-components'

import { UiDirectionType } from 'translations'

import iconClose from '../assets/IconClose.svg'
import iconKebabMenu from '../assets/IconKebabMenu.svg'
import dimensions from '../constants/dimensions'
import '../styles/KebabMenu.css'
import { Portal } from './Portal'

type KebabMenuProps = {
  items: Array<ReactNode>
  direction: UiDirectionType
}

const Toggle = styled.div`
  display: flex;
  padding: 0 12px;
  z-index: 32;
`

const List = styled.div<{ direction: UiDirectionType; checked: boolean }>`
  font-family: ${props => props.theme.fonts.web.decorativeFont};
  position: absolute;
  top: 0;
  width: 80vw;
  height: 100vh;
  background-color: ${props => props.theme.colors.backgroundColor};
  box-shadow: -3px 3px 3px 0 rgba(0, 0, 0, 0.13);
  -webkit-font-smoothing: antialiased;
  /* to stop flickering of text in safari 
   */
  transform-origin: 0% 0%;
  transition: transform 0.5s cubic-bezier(0.77, 0.2, 0.05, 1);
  z-index: 31;
  ${props =>
    props.direction === 'rtl' ? `left: 0;transform: translate(-100%, 0);` : `right:0; transform: translate(100%, 0);`}
  ${props => props.checked && `opacity: 1;transform: none;`}
`

const Icon = styled.img`
  z-index: 32;
  position: relative;
  width: 28px;
  height: 28px;
`

const Overlay = styled.div<{ checked: boolean }>`
  position: absolute;
  display: none;
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 30;
  ${props => (props.checked ? `display: block` : `display:none`)}
`

const Checkbox = styled.input`
  display: none;
`

const CheckboxLabel = styled.label`
  display: flex;
  justify-content: center;
`

const Heading = styled.div<{ direction: string }>`
  display: flex;
  ${props => (props.direction === 'rtl' ? `justify-content: flex-start;` : `justify-content: flex-end;`)}
  background-color: ${props => props.theme.colors.backgroundAccentColor};
  box-shadow: -3px 3px 3px 0 rgba(0, 0, 0, 0.13);
  height: ${dimensions.headerHeightSmall}px;
`

const Content = styled.div`
  padding: 0 32px;
`

const CloseButton = styled.button`
  background-color: transparent;
  border: none;
  padding: 0 12px;
`

const KebabMenu = ({ items, direction }: KebabMenuProps): ReactElement => {
  const [checked, setChecked] = useState<boolean>(false)

  return (
    <Toggle>
      <Checkbox
        data-testid='kebab-menu-checkbox'
        checked={checked}
        id='trigger'
        type='checkbox'
        onClick={() => setChecked(!checked)}
        onChange={e => setChecked(e.target.checked)}
      />
      <CheckboxLabel htmlFor='trigger'>
        <Icon src={iconKebabMenu} alt='' />
      </CheckboxLabel>
      <Portal className='kebab-menu' opened={checked}>
        {/* disabled because this is an overlay for backdrop close */}
        {/* eslint-disable-next-line styled-components-a11y/no-static-element-interactions,styled-components-a11y/click-events-have-key-events */}
        <Overlay onClick={() => setChecked(false)} checked={checked} />
        <List direction={direction} checked={checked}>
          <Heading direction={direction}>
            <CloseButton onClick={() => setChecked(!checked)}>
              <Icon src={iconClose} alt='' />
            </CloseButton>
          </Heading>
          <Content>{items}</Content>
        </List>
      </Portal>
    </Toggle>
  )
}

export default KebabMenu
