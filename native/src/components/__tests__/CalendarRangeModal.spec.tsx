import { fireEvent } from '@testing-library/react-native'
import { DateTime } from 'luxon'
import React from 'react'

import renderWithTheme from '../../testing/render'
import CalendarRangeModal from '../CalendarRangeModal'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'layout:cancel': 'Cancel',
        ok: 'OK',
        selectRange: 'Select Date Range',
      }
      return translations[key] || key
    },
  }),
}))

describe('CalendarRangeModal', () => {
  beforeEach(jest.clearAllMocks)

  const closeModal = jest.fn()
  const setFromDate = jest.fn()
  const setToDate = jest.fn()

  const renderCalendarRangeModal = () =>
    renderWithTheme(
      <CalendarRangeModal
        closeModal={closeModal}
        fromDate={DateTime.local()}
        modalVisible
        setFromDate={setFromDate}
        setToDate={setToDate}
        toDate={DateTime.local().plus({ day: 2 })}
      />,
    )

  it('should close modal on "Cancel" button press', () => {
    const { getByText } = renderCalendarRangeModal()

    fireEvent.press(getByText('Cancel'))
    expect(closeModal).toHaveBeenCalledTimes(1)
  })

  it('should set dates and close modal on "OK" button press', () => {
    const { getByText } = renderCalendarRangeModal()

    fireEvent.press(getByText('OK'))
    expect(setFromDate).toHaveBeenCalled()
    expect(setToDate).toHaveBeenCalled()
    expect(closeModal).toHaveBeenCalledTimes(1)
  })
})
