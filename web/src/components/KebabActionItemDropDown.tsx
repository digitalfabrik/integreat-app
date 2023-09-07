import React, { ReactElement, ReactNode, useRef, useState } from 'react'
import styled from 'styled-components'

import dimensions from '../constants/dimensions'
import useOnClickOutside from '../hooks/useOnClickOutside'
import useWindowDimensions from '../hooks/useWindowDimensions'
import { DropDownContainer } from './HeaderActionItemDropDown'
import KebabActionItemLink from './KebabActionItemLink'

const Button = styled.button`
  display: flex;
  border: none;
  cursor: pointer;
  background-color: transparent;
  flex: 1;
  padding: 0;
`

const Container = styled.div`
  display: flex;
`

type KebabActionItemDropDownProps = {
  children: (closeDropDown: () => void) => ReactNode
  iconSrc: string
  iconDirectionDepended?: boolean
  text: string
  closeSidebar: () => void
}

/**
 * Designed to work as an item of a HeaderActionBar. Once clicked, the child node becomes visible right underneath the
 * Header. Once the user clicks outside, the node is hidden again. Additionally, the inner node gets a
 * closeDropDownCallback through its props to close the dropDown and hide itself.
 */
const KebabActionItemDropDown = ({
  iconSrc,
  iconDirectionDepended = false,
  text,
  children,
  closeSidebar,
}: KebabActionItemDropDownProps): ReactElement => {
  const [dropDownActive, setDropDownActive] = useState(false)
  const { height } = useWindowDimensions()

  const toggleDropDown = (): void => {
    setDropDownActive(!dropDownActive)
  }

  const closeDropDown = (): void => {
    setDropDownActive(false)
  }

  const onClickDropdownItem = (): void => {
    closeDropDown()
    closeSidebar()
  }

  const wrapperRef = useRef(null)
  useOnClickOutside(wrapperRef, closeDropDown)

  return (
    <Container ref={wrapperRef}>
      <Button type='button' aria-label={text} onClick={toggleDropDown}>
        <KebabActionItemLink text={text} iconSrc={iconSrc} iconDirectionDepended={iconDirectionDepended} />
      </Button>
      <DropDownContainer
        data-testid='headerActionItemDropDown'
        active={dropDownActive}
        height={height - dimensions.headerHeightSmall}
        // We need to have the visibility here, else the jest-dom testing library can not assert on it
        style={{ visibility: dropDownActive ? 'visible' : 'hidden' }}>
        {children(onClickDropdownItem)}
      </DropDownContainer>
    </Container>
  )
}

export default KebabActionItemDropDown
