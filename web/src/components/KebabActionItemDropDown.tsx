import styled from '@emotion/styled'
import React, { ReactElement, ReactNode, useRef } from 'react'

import useOnClickOutside from '../hooks/useOnClickOutside'
import DropDownContainer from './DropDownContainer'

const Container = styled('div')`
  display: flex;
`

type KebabActionItemDropDownProps = {
  children: (closeDropDown: () => void) => ReactNode
  closeSidebar: () => void
}

/**
 * Designed to work as an item of a HeaderActionBar. Once clicked, the child node becomes visible right underneath the
 * Header. Once the user clicks outside, the node is hidden again. Additionally, the inner node gets a
 * closeDropDownCallback through its props to close the dropDown and hide itself.
 */
const KebabActionItemDropDown = ({ children, closeSidebar }: KebabActionItemDropDownProps): ReactElement => {
  const onClickDropdownItem = (): void => {
    closeSidebar()
  }

  const wrapperRef = useRef(null)
  useOnClickOutside(wrapperRef, closeSidebar)

  return (
    <Container ref={wrapperRef}>
      <DropDownContainer
        data-testid='headerActionItemDropDown'
        active
        // We need to have the visibility here, else the jest-dom testing library can not assert on it
        style={{ visibility: 'visible' }}>
        {children(onClickDropdownItem)}
      </DropDownContainer>
    </Container>
  )
}

export default KebabActionItemDropDown
