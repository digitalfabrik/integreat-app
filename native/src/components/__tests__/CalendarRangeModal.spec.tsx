import { fireEvent } from '@testing-library/react-native'
import { DateTime } from 'luxon'
import React from 'react'

import renderWithTheme from '../../testing/render'
import CalendarRangeModal from '../CalendarRangeModal'

jest.mock('react-i18next')

describe('CalendarRangeModal', () => {
  beforeEach(jest.clearAllMocks)

  const closeModal = jest.fn()
  const setFromDate = jest.fn()
  const setToDate = jest.fn()

  const renderCalendarRangeModal = () =>
    renderWithTheme(
      <CalendarRangeModal
        closeModal={closeModal}
        fromDate={DateTime.now()}
        modalVisible
        setFromDate={setFromDate}
        setToDate={setToDate}
        toDate={DateTime.now().plus({ day: 2 })}
      />,
    )

  it('should close modal on "Cancel" button press', () => {
    const { getByText } = renderCalendarRangeModal()

    fireEvent.press(getByText('layout:cancel'))
    expect(closeModal).toHaveBeenCalledTimes(1)
  })

  it('should set dates and close modal on "OK" button press', () => {
    const { getByText } = renderCalendarRangeModal()

    fireEvent.press(getByText('common:ok'))
    expect(setFromDate).toHaveBeenCalled()
    expect(setToDate).toHaveBeenCalled()
    expect(closeModal).toHaveBeenCalledTimes(1)
  })
})
