import React, { ReactElement, ReactNode, useRef, useState } from 'react'
import styled from 'styled-components'

import { UiDirectionType } from 'translations/src'

import useOnClickOutside from '../hooks/useOnClickOutside'
import { DropDownContainer } from './HeaderActionItemDropDown'
import KebabActionItemLink from './KebabActionItemLink'

const Button = styled.button`
  display: flex;
  border: none;
  background-color: transparent;
  flex: 1;
  padding: 0;
`

const Container = styled.div`
  display: flex;
`

type PropsType = {
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
const KebabActionItemDropDown = ({ iconSrc, text, children, direction }: PropsType): ReactElement => {
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
      <Button type='button' aria-label={text} onClick={toggleDropDown}>
        <KebabActionItemLink text={text} iconSrc={iconSrc} direction={direction} />
      </Button>
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

export default KebabActionItemDropDown
