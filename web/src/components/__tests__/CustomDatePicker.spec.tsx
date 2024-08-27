import { fireEvent } from '@testing-library/react'
import React from 'react'

import { renderWithTheme } from '../../testing/render'
import CustomDatePicker from '../CustomDatePicker'

describe('CustomDatePicker_web', () => {
  const setValue = jest.fn()
  const testDateIsoFormat = '2024-08-26'
  const renderCustomDatePicker = () =>
    renderWithTheme(<CustomDatePicker title='from' value={testDateIsoFormat} setValue={setValue} error='' />)

  it('should convert ISO date to EU format in input', () => {
    const { getByAltText } = renderCustomDatePicker()
    expect(getByAltText('Date-input')).toHaveAttribute('value', testDateIsoFormat)
  })
  it('should change date', () => {
    const { getByAltText } = renderCustomDatePicker()

    fireEvent.change(getByAltText('Date-input'), { target: { value: '2024-08-22' } })

    expect(setValue).toHaveBeenCalledWith('2024-08-22')
  })
})
