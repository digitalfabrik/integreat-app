import React, { ReactElement, ReactNode, useRef, useState } from 'react'
import styled from 'styled-components'

import { UiDirectionType } from 'translations/src'

import dimensions from '../constants/dimensions'
import useOnClickOutside from '../hooks/useOnClickOutside'
import IconWithUiDirection from './IconWithUiDirection'
import Tooltip from './Tooltip'

export const Container = styled.div`
  width: calc(0.8 * ${dimensions.headerHeightLarge}px);
  height: calc(0.8 * ${dimensions.headerHeightLarge}px);
  box-sizing: border-box;

  @media ${dimensions.smallViewport} {
    width: calc(0.8 * ${dimensions.headerHeightSmall}px);
    height: calc(0.8 * ${dimensions.headerHeightSmall}px);
  }

  & button {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    cursor: pointer;
    background-color: ${props => props.theme.colors.backgroundAccentColor};
    border: none;
  }

  & button > img {
    box-sizing: border-box;
    padding: 22%;
    object-fit: contain;
    width: 100%;
    height: 100%;
  }
`

export const DropDownContainer = styled.div<{ active: boolean }>`
  position: absolute;
  top: ${dimensions.headerHeightLarge}px;
  right: 0;
  width: 100%;
  box-sizing: border-box;
  opacity: ${props => (props.active ? '1' : '0')};
  z-index: 1; /* this is only necessary for IE11 to have the DropDown above NavigationItems */

  transform: scale(${props => (props.active ? '1' : '0.9')});
  transform-origin: center top;
  justify-content: center;
  box-shadow: 0 2px 5px -3px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s, opacity 0.2s, visibility 0s ${props => (props.active ? '0s' : '0.2s')};
  background-color: ${props => props.theme.colors.backgroundColor};
  visibility: ${props => (props.active ? 'visible' : 'hidden')};

  @media ${dimensions.smallViewport} {
    top: ${dimensions.headerHeightSmall}px;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
  }

  @media ${dimensions.minMaxWidth} {
    padding-right: calc((200% - 100vw - ${dimensions.maxWidth}px) / 2);
    padding-left: calc((100vw - ${dimensions.maxWidth}px) / 2);
  }
`

type HeaderActionItemDropDownProps = {
  children: (closeDropDown: () => void) => ReactNode
  iconSrc: string
  text: string
  direction?: UiDirectionType
}

/**
 * Designed to work as an item of a HeaderActionBar. Once clicked, the child node becomes visible right underneath the
 * Header. Once the user clicks outside, the node is hidden again. Additionally, the inner node gets a
 * closeDropDownCallback through its props to close the dropDown and hide itself.
 */
const HeaderActionItemDropDown = ({
  iconSrc,
  text,
  children,
  direction,
}: HeaderActionItemDropDownProps): ReactElement => {
  const [dropDownActive, setDropDownActive] = useState(false)

  const toggleDropDown = (): void => {
    setDropDownActive(!dropDownActive)
  }

  const closeDropDown = (): void => {
    setDropDownActive(false)
  }

  const wrapperRef = useRef(null)
  useOnClickOutside(wrapperRef, closeDropDown)

  return (
    <Container ref={wrapperRef}>
      <Tooltip text={text} flow='down' mediumViewportFlow='left'>
        <button type='button' aria-label={text} onClick={toggleDropDown}>
          <IconWithUiDirection alt='' src={iconSrc} direction={direction} />
        </button>
      </Tooltip>
      <DropDownContainer
        data-testid='headerActionItemDropDown'
        active={dropDownActive}
        // We need to have the visibility here, else the jest-dom testing library can not assert on it
        style={{ visibility: dropDownActive ? 'visible' : 'hidden' }}>
        {children(closeDropDown)}
      </DropDownContainer>
    </Container>
  )
}

export default HeaderActionItemDropDown
