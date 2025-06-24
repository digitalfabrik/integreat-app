import styled from '@emotion/styled'
import React, { ReactElement, ReactNode, useRef, useState } from 'react'

import useOnClickOutside from '../hooks/useOnClickOutside'
import { spacesToDashes } from '../utils/stringUtils'
import DropDownContainer from './DropDownContainer'
import Button from './base/Button'
import Icon from './base/Icon'
import Tooltip from './base/Tooltip'

const StyledIcon = styled(Icon)`
  width: 28px;
  height: 28px;
`
const ActionBox = styled(Button)`
  padding: 4px 6px;
  display: flex;
  color: ${props => props.theme.colors.textColor};
  border: 1px solid ${props => props.theme.colors.textColor};
  border-radius: 4px;
  justify-content: center;
  align-items: center;
  gap: 4px;
`

const StyledText = styled.span`
  font-weight: bold;
  font-size: 14px;
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

  const id = spacesToDashes(text)

  return (
    <div ref={wrapperRef}>
      <Tooltip id={id} tooltipContent={text}>
        {innerText ? (
          <ActionBox label={text} onClick={toggleDropDown}>
            <StyledIcon src={iconSrc} />
            <StyledText>{innerText}</StyledText>
          </ActionBox>
        ) : (
          <Button label={text} onClick={toggleDropDown} id={id}>
            <StyledIcon src={iconSrc} />
          </Button>
        )}
      </Tooltip>
      <DropDownContainer
        data-testid='headerActionItemDropDown'
        active={dropDownActive}
        // We need to have the visibility here, else the jest-dom testing library can not assert on it
        style={{ visibility: dropDownActive ? 'visible' : 'hidden' }}>
        {children(closeDropDown)}
      </DropDownContainer>
    </div>
  )
}

export default HeaderActionItemDropDown
