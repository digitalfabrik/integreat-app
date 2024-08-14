import React, { ReactElement, ReactNode, useRef, useState } from 'react'
import styled from 'styled-components'

import useOnClickOutside from '../hooks/useOnClickOutside'
import DropDownContainer from './DropDownContainer'
import Tooltip from './Tooltip'
import Button from './base/Button'
import Icon from './base/Icon'

const StyledIcon = styled(Icon)`
  width: 28px;
  height: 28px;
`
const ActionBox = styled(Button)`
  height: 36px;
  min-width: 122px;
  display: flex;
  border-color: black;
  border-width: 1px;
  border-style: solid;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
`

const StyledText = styled.span`
  font-weight: bold;
  font-size: 14px;
  margin: 0px 5px;
  letter-spacing: 1.25px;
`

type HeaderActionItemDropDownProps = {
  children: (closeDropDown: () => void) => ReactNode
  iconSrc: string
  text: string
  innerText?: string
}

/**
 * Designed to work as an item of a HeaderActionBar. Once clicked, the child node becomes visible right underneath the
 * Header. Once the user clicks outside, the node is hidden again. Additionally, the inner node gets a
 * closeDropDownCallback through its props to close the dropDown and hide itself.
 */
const HeaderActionItemDropDown = ({
  iconSrc,
  text,
  innerText,
  children,
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
    <div ref={wrapperRef}>
      <Tooltip text={text} flow='down' mediumViewportFlow='left'>
        {innerText ? (
          <ActionBox label={text} onClick={toggleDropDown}>
            <StyledIcon src={iconSrc} />
            <StyledText>{innerText}</StyledText>
          </ActionBox>
        ) : (
          <Button label={text} onClick={toggleDropDown}>
            <StyledIcon src={iconSrc} />
          </Button>
        )}
      </Tooltip>
      <DropDownContainer
        data-testid='headerActionItemDropDown'
        $active={dropDownActive}
        // We need to have the visibility here, else the jest-dom testing library can not assert on it
        style={{ visibility: dropDownActive ? 'visible' : 'hidden' }}>
        {children(closeDropDown)}
      </DropDownContainer>
    </div>
  )
}

export default HeaderActionItemDropDown
