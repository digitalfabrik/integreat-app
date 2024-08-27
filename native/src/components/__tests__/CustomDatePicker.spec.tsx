import React from 'react'

import render from '../../testing/render'
import CustomDatePicker from '../CustomDatePicker'

describe('CustomDatePicker_native', () => {
  const setValue = jest.fn()
  const setModalState = jest.fn()
  const testDateIsoFormat = '2024-08-26'
  const testDateEuFormat = '26/08/2024'
  const renderCustomDatePicker = () =>
    render(
      <CustomDatePicker
        modalState
        setModalState={setModalState}
        setValue={setValue}
        title='from'
        value={testDateIsoFormat}
        error=''
      />,
    )

  it('should convert ISO date to EU format in input', () => {
    const { getByTestId } = renderCustomDatePicker()
    expect(getByTestId('DatePicker-input').props.value).toBe(testDateEuFormat)
  })
})
