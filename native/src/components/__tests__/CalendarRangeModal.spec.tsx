import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import render from '../../testing/render'
import CalendarRangeModal from '../CalendarRangeModal'

describe('CalendarRangeModal', () => {
  beforeEach(jest.clearAllMocks)

  const closeModal = jest.fn()
  const setFromDate = jest.fn()
  const setToDate = jest.fn()

  const renderCalendarRangeModal = () =>
    render(
      <CalendarRangeModal
        closeModal={closeModal}
        fromDate='2024-08-26'
        modalVisible
        setFromDate={setToDate}
        setToDate={setFromDate}
        toDate='2024-08-29'
      />,
    )

  it('should close modal on button press', () => {
    const { getByText } = renderCalendarRangeModal()

    fireEvent.press(getByText('cancel'))
    expect(closeModal).toHaveBeenCalledTimes(1)
  })
})
