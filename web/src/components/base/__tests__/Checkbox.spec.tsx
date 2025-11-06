import { fireEvent } from '@testing-library/react'
import React from 'react'

import { renderWithTheme } from '../../../testing/render'
import Checkbox from '../Checkbox'

describe('Checkbox', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  const setChecked = jest.fn()

  it('should select checkbox on press', () => {
    const { getByRole } = renderWithTheme(<Checkbox checked={false} setChecked={setChecked} label='send' />)
    fireEvent.click(getByRole('checkbox'))
    expect(setChecked).toHaveBeenCalledTimes(1)
    expect(setChecked).toHaveBeenCalledWith(true)
  })

  it('should deselect checkbox on press', () => {
    const { getByRole } = renderWithTheme(<Checkbox checked setChecked={setChecked} label='send' />)
    fireEvent.click(getByRole('checkbox'))
    expect(setChecked).toHaveBeenCalledTimes(1)
    expect(setChecked).toHaveBeenCalledWith(false)
  })
})
