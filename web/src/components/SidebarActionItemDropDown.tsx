import styled from '@emotion/styled'
import { SvgIconProps } from '@mui/material/SvgIcon'
import React, { ElementType, ReactElement, ReactNode, useRef, useState } from 'react'

import useOnClickOutside from '../hooks/useOnClickOutside'
import DropDownContainer from './DropDownContainer'
import SidebarActionItem from './SidebarActionItem'
import Button from './base/Button'

const StyledButton = styled(Button)`
  display: flex;
  flex: 1;
`

const Container = styled.div`
  display: flex;
`

type SidebarActionItemDropDownProps = {
  children: (closeDropDown: () => void) => ReactNode
  iconSrc: string | ElementType<SvgIconProps>
  text: string
  closeSidebar: () => void
  isOpen?: boolean
}

/**
 * Designed to work as an item of a HeaderActionBar. Once clicked, the child node becomes visible right underneath the
 * Header. Once the user clicks outside, the node is hidden again. Additionally, the inner node gets a
 * closeDropDownCallback through its props to close the dropDown and hide itself.
 */
const SidebarActionItemDropDown = ({
  iconSrc,
  text,
  children,
  closeSidebar,
  isOpen = false,
}: SidebarActionItemDropDownProps): ReactElement => {
  const [dropDownActive, setDropDownActive] = useState(isOpen)

  const toggleDropDown = (): void => {
    setDropDownActive(!dropDownActive)
  }

  const closeDropDown = (): void => {
    setDropDownActive(false)
  }

  const onClickDropdownItem = (): void => {
    if (!isOpen) {
      closeDropDown()
    }
    closeSidebar()
  }

  const wrapperRef = useRef(null)

  useOnClickOutside(wrapperRef, isOpen ? () => undefined : closeDropDown)

  return (
    <Container ref={wrapperRef}>
      <StyledButton label={text} onClick={toggleDropDown}>
        <SidebarActionItem text={text} iconSrc={iconSrc} />
      </StyledButton>

      <DropDownContainer
        data-testid='headerActionItemDropDown'
        active={dropDownActive}
        // We need to have the visibility here, else the jest-dom testing library can not assert on it
        style={{ visibility: dropDownActive ? 'visible' : 'hidden' }}>
        {children(onClickDropdownItem)}
      </DropDownContainer>
    </Container>
  )
}

export default SidebarActionItemDropDown
