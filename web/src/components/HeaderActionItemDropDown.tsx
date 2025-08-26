import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { useTheme, styled } from '@mui/material/styles'
import React, { ReactElement, ReactNode, useRef, useState } from 'react'

import useOnClickOutside from '../hooks/useOnClickOutside'
import DropDownContainer from './DropDownContainer'

const StyledButton = styled(Button)`
  background-color: ${props => props.theme.palette.tertiary.light};
  padding: 2px 14px;
`

type HeaderActionItemDropDownProps = {
  children: (closeDropDown: () => void) => ReactNode
  icon: ReactElement
  text: string
  innerText?: string
}

/**
 * Designed to work as an item of a HeaderActionBar. Once clicked, the child node becomes visible right underneath the
 * Header. Once the user clicks outside, the node is hidden again. Additionally, the inner node gets a
 * closeDropDownCallback through its props to close the dropDown and hide itself.
 */
const HeaderActionItemDropDown = ({ icon, text, innerText, children }: HeaderActionItemDropDownProps): ReactElement => {
  const [dropDownActive, setDropDownActive] = useState(false)
  const theme = useTheme()

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
      <Tooltip title={text}>
        {innerText ? (
          <StyledButton onClick={toggleDropDown} name={text} aria-label={text} startIcon={icon}>
            {innerText}
          </StyledButton>
        ) : (
          <IconButton
            onClick={toggleDropDown}
            name={text}
            color='primary'
            sx={{ backgroundColor: theme.palette.tertiary.light }}
            aria-label={text}>
            {icon}
          </IconButton>
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
