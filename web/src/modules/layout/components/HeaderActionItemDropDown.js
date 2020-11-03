// @flow

import * as React from 'react'
import styled from 'styled-components'
import type { ThemeType } from '../../theme/constants/theme'
import { useRef, useState } from 'react'
import useOnClickOutside from '../hooks/useOnClickOutside'

export const Container = styled.div`
  width: calc(0.8 * ${props => props.theme.dimensions.headerHeightLarge}px);
  height: calc(0.8 * ${props => props.theme.dimensions.headerHeightLarge}px);
  box-sizing: border-box;

  @media ${props => props.theme.dimensions.smallViewport} {
    width: calc(0.8 * ${props => props.theme.dimensions.headerHeightSmall}px);
    height: calc(0.8 * ${props => props.theme.dimensions.headerHeightSmall}px);
  }

  & > button {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    cursor: pointer;
    background-color: ${props => props.theme.colors.backgroundAccentColor};
    border: none;

  }

  & > button > img {
    box-sizing: border-box;
    padding: 22%;
    object-fit: contain;
    width: 100%;
    height: 100%;
  }
`

export const DropDownContainer = styled.div`
  position: absolute;
  top: ${props => props.theme.dimensions.headerHeightLarge}px;
  right: 0;
  width: 100%;
  box-sizing: border-box;
  z-index: 1; /* this is only necessary for IE11 to have the DropDown above NavigationItems */

  transform: scale(1);
  transform-origin: center top;
  justify-content: center;
  box-shadow: 0 2px 5px -3px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s, opacity 0.2s, visibility 0s ${props => props.active ? '0s' : '0.2s'};
  background-color: ${props => props.theme.colors.backgroundColor};

  @media ${props => props.theme.dimensions.smallViewport} {
    top: ${props => props.theme.dimensions.headerHeightSmall}px;
  }

  @media ${props => props.theme.dimensions.minMaxWidth} {
    padding-right: calc((200% - 100vw - ${props => props.theme.dimensions.maxWidth}px) / 2);
    padding-left: calc((100vw - ${props => props.theme.dimensions.maxWidth}px) / 2);
  }
`

type PropsType = {|
  children: (closeDropDown: () => void) => React.Element<*>,
  theme: ThemeType,
  iconSrc: string,
  text: string
|}

/**
 * Designed to work as an item of a HeaderActionBar. Once clicked, the child node becomes visible right underneath the
 * Header. Once the user clicks outside, the node is hidden again. Additionally, the inner node gets a
 * closeDropDownCallback through its props to close the dropDown and hide itself.
 */
const HeaderActionItemDropDown = (props: PropsType) => {
  const { iconSrc, text, children, theme } = props
  const [dropDownActive, setDropDownActive] = useState(false)

  const toggleDropDown = () => {
    setDropDownActive(!dropDownActive)
  }

  const closeDropDown = () => {
    setDropDownActive(false)
  }

  const clickOutside = () => {
    setDropDownActive(false)
  }

  const wrapperRef = useRef(null)
  useOnClickOutside(wrapperRef, clickOutside)

  return <Container ref={wrapperRef} theme={theme}>
    <button selector='button' data-tip={text} data-event='mouseover' data-event-off='click mouseout' aria-label={text}
            onClick={toggleDropDown}>
      <img alt='' src={iconSrc} />
    </button>
    {dropDownActive && <DropDownContainer active={dropDownActive} theme={theme}>
      {children(closeDropDown)}
    </DropDownContainer>}
  </Container>
}

export default HeaderActionItemDropDown
