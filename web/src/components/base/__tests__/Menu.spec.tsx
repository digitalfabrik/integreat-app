import MoreVertIcon from '@mui/icons-material/MoreVert'
import MenuItem from '@mui/material/MenuItem'
import { act, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'

import { renderWithTheme } from '../../../testing/render'
import Menu from '../Menu'

describe('Menu', () => {
  const onItemClick = jest.fn()

  const renderMenu = () =>
    renderWithTheme(
      <>
        <button type='button'>Outside</button>
        <Menu icon={<MoreVertIcon />} label='Menu'>
          {closeMenu => (
            <MenuItem
              onClick={() => {
                closeMenu()
                onItemClick()
              }}>
              Item
            </MenuItem>
          )}
        </Menu>
      </>,
    )

  beforeEach(jest.clearAllMocks)

  it('should open and close the menu with the menu button', async () => {
    const { getByRole, queryByRole } = renderMenu()
    const button = getByRole('button', { name: 'Menu' })

    fireEvent.click(button)
    expect(getByRole('menuitem', { name: 'Item' })).toHaveFocus()
    expect(button).toHaveAttribute('aria-expanded', 'true')

    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'false')
    await waitFor(() => expect(queryByRole('menuitem')).toBeNull())
  })

  it('should not hide the rest of the page from screen readers', () => {
    const { getByRole } = renderMenu()

    fireEvent.click(getByRole('button', { name: 'Menu' }))

    expect(getByRole('button', { name: 'Outside' })).toBeTruthy()
    expect(getByRole('button', { name: 'Menu' })).toBeTruthy()
  })

  it('should close the menu on click outside', async () => {
    const { getByRole, queryByRole } = renderMenu()

    fireEvent.click(getByRole('button', { name: 'Menu' }))
    // The click away listener is only activated after the click opening the menu
    await act(async () => {
      await new Promise(resolve => {
        setTimeout(resolve, 0)
      })
    })
    fireEvent.click(getByRole('button', { name: 'Outside' }))

    await waitFor(() => expect(queryByRole('menuitem')).toBeNull())
  })

  it.each(['Escape', 'Tab'])('should close the menu and focus the menu button on %s', async key => {
    const { getByRole, queryByRole } = renderMenu()
    const button = getByRole('button', { name: 'Menu' })

    fireEvent.click(button)
    fireEvent.keyDown(getByRole('menuitem', { name: 'Item' }), { key })

    expect(button).toHaveFocus()
    await waitFor(() => expect(queryByRole('menuitem')).toBeNull())
  })

  it('should not propagate escape to surrounding elements', () => {
    const onParentKeyDown = jest.fn()
    const { getByRole } = renderWithTheme(
      <div onKeyDown={onParentKeyDown} role='presentation'>
        <Menu icon={<MoreVertIcon />} label='Menu' disablePortal>
          {() => <MenuItem>Item</MenuItem>}
        </Menu>
      </div>,
    )

    fireEvent.click(getByRole('button', { name: 'Menu' }))
    fireEvent.keyDown(getByRole('menuitem', { name: 'Item' }), { key: 'Escape' })

    expect(onParentKeyDown).not.toHaveBeenCalled()
  })

  it('should close the menu and focus the menu button when an item is selected', async () => {
    const { getByRole, queryByRole } = renderMenu()
    const button = getByRole('button', { name: 'Menu' })

    fireEvent.click(button)
    fireEvent.click(getByRole('menuitem', { name: 'Item' }))

    expect(onItemClick).toHaveBeenCalledTimes(1)
    expect(button).toHaveFocus()
    await waitFor(() => expect(queryByRole('menuitem')).toBeNull())
  })
})
