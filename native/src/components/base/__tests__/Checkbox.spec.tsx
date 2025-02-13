import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import render from '../../../testing/render'
import Checkbox from '../Checkbox'

describe('Checkbox', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  const setChecked = jest.fn()

  it('should select checkbox on press', () => {
    const { getByRole } = render(<Checkbox checked={false} setChecked={setChecked} />)
    fireEvent(getByRole('checkbox'), 'onValueChange', true)
    expect(setChecked).toHaveBeenCalledTimes(1)
    expect(setChecked).toHaveBeenCalledWith(true)
  })

  it('should deselect already selected checkbox on press', () => {
    const { getByRole } = render(<Checkbox checked setChecked={setChecked} />)
    fireEvent(getByRole('checkbox'), 'onValueChange', false)
    expect(setChecked).toHaveBeenCalledTimes(1)
    expect(setChecked).toHaveBeenCalledWith(false)
  })
})
