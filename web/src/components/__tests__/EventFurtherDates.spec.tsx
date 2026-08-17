import { fireEvent, waitFor } from '@testing-library/react'
import { DateTime } from 'luxon'
import React from 'react'
import { rrulestr } from 'rrule'

import { DateModel } from 'shared/api'

import { mockDimensions } from '../../__mocks__/useDimensions'
import useDimensions from '../../hooks/useDimensions'
import { renderWithTheme } from '../../testing/render'
import EventFurtherDates from '../EventFurtherDates'

jest.mock('../../hooks/useDimensions')
jest.mock('react-i18next')

jest.useFakeTimers({ now: new Date('2023-10-09T15:23:57.443+02:00') })
describe('EventFurtherDates', () => {
  const { mocked } = jest
  beforeEach(() =>
    mocked(useDimensions).mockImplementation(() => ({ ...mockDimensions, mobile: false, desktop: true })),
  )

  const date = (rrule?: string) =>
    new DateModel({
      startDate: DateTime.fromISO('2023-10-09T07:00:00.000+02:00'),
      endDate: DateTime.fromISO('2023-10-10T09:00:00.000+02:00'),
      allDay: false,
      recurrenceRule: rrule ? rrulestr(rrule) : null,
      onlyWeekdays: false,
    })

  it('should render nothing for a non-recurring event', () => {
    const { queryByText } = renderWithTheme(<EventFurtherDates date={date()} languageCode='de' />)

    expect(queryByText('events:furtherDates')).toBeFalsy()
  })

  it('should reveal the upcoming dates when expanding a monthly recurring event', async () => {
    const { getAllByText, getByRole, getByText, queryByText } = renderWithTheme(
      <EventFurtherDates date={date('DTSTART:20230414T050000\nRRULE:FREQ=MONTHLY;BYDAY=+2MO')} languageCode='de' />,
    )

    expect(getByText('events:furtherDates')).toBeTruthy()
    expect(getByText('13. Nov. 2023')).not.toBeVisible()

    fireEvent.click(getByRole('button'))

    await waitFor(() => expect(getByText('13. Nov. 2023')).toBeVisible())
    expect(queryByText('9. Okt. 2023')).toBeFalsy()
    expect(getByText('11. Dez. 2023')).toBeVisible()
    expect(getByText('11. März 2024')).toBeVisible()
    expect(getAllByText('7:00 - 9:00')).toHaveLength(5)
    expect(getByText('…')).toBeVisible()
  })

  it('should reveal the upcoming dates when expanding a weekly recurring event', async () => {
    const { getAllByText, getByRole, getByText } = renderWithTheme(
      <EventFurtherDates date={date('DTSTART:20230414T050000\nRRULE:FREQ=WEEKLY;BYDAY=MO')} languageCode='de' />,
    )

    fireEvent.click(getByRole('button'))

    await waitFor(() => expect(getByText('16. Okt. 2023')).toBeVisible())
    expect(getByText('13. Nov. 2023')).toBeVisible()
    expect(getAllByText('7:00 - 9:00')).toHaveLength(5)
    expect(getByText('…')).toBeVisible()
  })

  it('should reveal fewer dates and hide the repeated time on mobile', async () => {
    mocked(useDimensions).mockImplementation(() => ({ ...mockDimensions, mobile: true }))
    const { getByRole, getByText, queryByText } = renderWithTheme(
      <EventFurtherDates date={date('DTSTART:20230414T050000\nRRULE:FREQ=MONTHLY;BYDAY=+2MO')} languageCode='de' />,
    )

    fireEvent.click(getByRole('button'))

    await waitFor(() => expect(getByText('8. Jan. 2024')).toBeVisible())
    expect(queryByText('12. Feb. 2024')).toBeFalsy()
    expect(queryByText('7:00 - 9:00')).toBeFalsy()
    expect(getByText('…')).toBeVisible()
  })

  it('should show the time on mobile if it differs between the dates', async () => {
    mocked(useDimensions).mockImplementation(() => ({ ...mockDimensions, mobile: true }))
    const { getByRole, getByText } = renderWithTheme(
      <EventFurtherDates
        date={date('DTSTART:20231016T050000\nRDATE:20231016T050000\nRDATE:20231018T090000\nRDATE:20231020T130000')}
        languageCode='de'
      />,
    )

    fireEvent.click(getByRole('button'))

    await waitFor(() => expect(getByText('18. Okt. 2023')).toBeVisible())
    expect(getByText('9:00 - 11:00')).toBeVisible()
    expect(getByText('20. Okt. 2023')).toBeVisible()
    expect(getByText('13:00 - 15:00')).toBeVisible()
  })
})
