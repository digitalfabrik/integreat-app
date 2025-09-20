import { styled } from '@mui/material/styles'
import React, { ReactElement, useRef } from 'react'

import useDimensions from '../hooks/useDimensions'
import useOnClickOutside from '../hooks/useOnClickOutside'

const DropdownContainer = styled('div')<{ open: boolean; headerHeight: number }>`
  position: absolute;
  top: ${props => props.headerHeight}px;
  inset-inline-end: 0;
  width: 100%;
  box-sizing: border-box;
  opacity: ${props => (props.open ? '1' : '0')};
  z-index: 1;
  transform: scale(${props => (props.open ? '1' : '0.9')});
  transform-origin: center top;
  justify-content: center;
  box-shadow: 0 2px 5px -3px rgb(0 0 0 / 20%);
  transition:
    transform 0.2s,
    opacity 0.2s,
    visibility 0s ${props => (props.open ? '0s' : '0.2s')};
  background-color: ${props => props.theme.legacy.colors.backgroundColor};
  visibility: ${props => (props.open ? 'visible' : 'hidden')};

  ${props => props.theme.breakpoints.down('md')} {
    top: ${props => props.headerHeight}px;
    height: calc(100% - ${props => props.headerHeight}px);
    overflow: hidden auto;
  }

  ${props => props.theme.breakpoints.up('lg')} {
    padding-inline: calc((100vw - ${props => props.theme.breakpoints.values.lg}px) / 2)
      calc((200% - 100vw - ${props => props.theme.breakpoints.values.lg}px) / 2);
  }
`

type DropdownProps = {
  ToggleButton: ReactElement
  children: ReactElement
  open: boolean
  setOpen: (expanded: boolean) => void
}

const Dropdown = ({ ToggleButton, children, open, setOpen }: DropdownProps): ReactElement => {
  const wrapperRef = useRef(null)
  const { headerHeight } = useDimensions()
  useOnClickOutside(wrapperRef, () => setOpen(false))

  return (
    <div ref={wrapperRef}>
      {ToggleButton}
      <DropdownContainer
        headerHeight={headerHeight}
        data-testid='headerActionItemDropDown'
        open={open}
        // We need to have the visibility here, else the jest-dom testing library can not assert on it
        style={{ visibility: open ? 'visible' : 'hidden' }}>
        {children}
      </DropdownContainer>
    </div>
  )
}

export default Dropdown
