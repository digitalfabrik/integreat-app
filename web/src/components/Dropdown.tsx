import React, { ReactElement, useRef } from 'react'

import useOnClickOutside from '../hooks/useOnClickOutside'
import DropDownContainer from './DropDownContainer'

type DropdownProps = {
  ToggleButton: ReactElement
  children: ReactElement
  open: boolean
  setOpen: (expanded: boolean) => void
}

const Dropdown = ({ ToggleButton, children, open, setOpen }: DropdownProps): ReactElement => {
  const wrapperRef = useRef(null)
  useOnClickOutside(wrapperRef, () => setOpen(false))

  return (
    <div ref={wrapperRef}>
      {ToggleButton}
      <DropDownContainer
        data-testid='headerActionItemDropDown'
        active={open}
        // We need to have the visibility here, else the jest-dom testing library can not assert on it
        style={{ visibility: open ? 'visible' : 'hidden' }}>
        {children}
      </DropDownContainer>
    </div>
  )
}

export default Dropdown
