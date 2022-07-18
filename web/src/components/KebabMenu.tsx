import React, { ReactElement } from 'react'
import styled from 'styled-components'

import iconClose from '../assets/close-icon.svg'

type KebabMenuProps = {}

const Toggle = styled.div`
  display: block;
  position: absolute;
  top: 20px;
  right: 10px;
  z-index: 1;
  -webkit-user-select: none;
  user-select: none;
`

const Dot = styled.span`
  right: 20px;
  display: block;
  width: 4px;
  height: 4px;
  margin-bottom: 5px;
  position: relative;
  background: #000000;
  border-radius: 3px;
  z-index: 1;
`

const List = styled.ul`
  position: absolute;
  width: 300px;
  height: 100vh;
  margin: -100px 0 0 0;
  padding: 50px;
  padding-top: 125px;
  right: -100px;

  background: #ededed;
  list-style-type: none;
  -webkit-font-smoothing: antialiased;
  /* to stop flickering of text in safari 
   */
  transform-origin: 0% 0%;
  transform: translate(100%, 0);
  transition: transform 0.5s cubic-bezier(0.77, 0.2, 0.05, 1);
`

const CloseIcon = styled.img`
  opacity: 0;
  z-index: 1;
  position: absolute;
  top: 0;
  right: 10px;
`

const Checkbox = styled.input`
  display: block;
  width: 40px;
  height: 32px;
  position: absolute;
  top: 0px;
  right: 10px;

  cursor: pointer;

  opacity: 0; /* hide this */
  z-index: 2; /* and place it over the hamburger */

  -webkit-touch-callout: none;

  &:checked ~ ${List} {
    transform: none;
    opacity: 1;
  }

  &:checked ~ ${CloseIcon} {
    opacity: 1;
  }

  &:checked ~ ${Dot} {
    opacity: 0;
  }
`

const KebabMenu = (props: KebabMenuProps): ReactElement => {
  return (
    <Toggle id='menuToggle'>
      <Checkbox type='checkbox' />

      <Dot />
      <Dot />
      <Dot />
      <CloseIcon src={iconClose} alt='' />

      <List>
        <a href='#'>
          <li>Home</li>
        </a>
      </List>
    </Toggle>
  )
}

export default KebabMenu
