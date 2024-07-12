import React, { ReactElement, ReactNode, useRef, useState } from 'react'
import { Tooltip } from 'react-tooltip'
import styled from 'styled-components'

import useOnClickOutside from '../hooks/useOnClickOutside'
import { spacesToDashes } from '../utils/stringUtils'
import DropDownContainer from './DropDownContainer'
import Button from './base/Button'
import Icon from './base/Icon'

const StyledIcon = styled(Icon)`
  width: 28px;
  height: 28px;
`

type HeaderActionItemDropDownProps = {
  children: (closeDropDown: () => void) => ReactNode
  iconSrc: string
  text: string
}

/**
 * Designed to work as an item of a HeaderActionBar. Once clicked, the child node becomes visible right underneath the
 * Header. Once the user clicks outside, the node is hidden again. Additionally, the inner node gets a
 * closeDropDownCallback through its props to close the dropDown and hide itself.
 */
const HeaderActionItemDropDown = ({ iconSrc, text, children }: HeaderActionItemDropDownProps): ReactElement => {
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
      <Button label={text} onClick={toggleDropDown} id={id}>
        <StyledIcon src={iconSrc} />
      </Button>
      <Tooltip anchorSelect={`#${id}`}>{text}</Tooltip>
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
