import MenuList from '@mui/material/MenuList'
import { fireEvent } from '@testing-library/react'
import React from 'react'

import { renderWithRouterAndTheme } from '../../testing/render'
import MenuItem from '../MenuItem'

describe('MenuItem', () => {
  it('should allow navigating through link and button items with the arrow keys', () => {
    const { getByRole } = renderWithRouterAndTheme(
      <MenuList autoFocusItem>
        <MenuItem text='Link' to='https://example.com' />
        <MenuItem text='First button' onClick={jest.fn()} />
        <MenuItem text='Second button' onClick={jest.fn()} />
      </MenuList>,
    )

    expect(getByRole('menuitem', { name: 'Link' })).toHaveFocus()
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' })
    expect(getByRole('menuitem', { name: 'First button' })).toHaveFocus()
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' })
    expect(getByRole('menuitem', { name: 'Second button' })).toHaveFocus()
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' })
    expect(getByRole('menuitem', { name: 'First button' })).toHaveFocus()
  })
})
