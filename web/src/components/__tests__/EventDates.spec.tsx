import { fireEvent, waitFor } from '@testing-library/react'
import { DateTime } from 'luxon'
import React from 'react'
import { rrulestr } from 'rrule'

import { DateModel, EventModelBuilder } from 'shared/api'

import { mockDimensions } from '../../__mocks__/useDimensions'
import useDimensions from '../../hooks/useDimensions'
import { renderWithTheme } from '../../testing/render'
import EventDates from '../EventDates'

jest.mock('../../hooks/useDimensions')

jest.useFakeTimers({ now: new Date('2023-10-09T15:23:57.443+02:00') })
describe('EventDates', () => {
  const { mocked } = jest
  const language = 'de'
  const baseEvent = new EventModelBuilder('seed', 1, 'augsburg', language).build()[0]!

  beforeEach(() =>
    mocked(useDimensions).mockImplementation(() => ({ ...mockDimensions, mobile: false, desktop: true })),
  )

  const eventWithDate = (rrule?: string) =>
    Object.assign(baseEvent, {
      _date: new DateModel({
        startDate: DateTime.fromISO('2023-10-09T07:00:00.000+02:00'),
        endDate: DateTime.fromISO('2023-10-10T09:00:00.000+02:00'),
        allDay: false,
        recurrenceRule: rrule ? rrulestr(rrule) : null,
        onlyWeekdays: false,
      }),
    })

  it('should render the upcoming date row for a non-recurring event', () => {
    const event = eventWithDate()
    const { getByText, queryByText } = renderWithTheme(<EventDates event={event} languageCode={language} />)

    expect(getByText('Mo., 9. Okt. - Di., 10. Okt.', { exact: false })).toBeTruthy()
    expect(getByText('7:00 - 9:00', { exact: false })).toBeTruthy()
    expect(queryByText('furtherDates')).toBeFalsy()
  })

  it('should render the next recurrence as the upcoming date for a recurring event', () => {
    const event = eventWithDate('DTSTART:20230414T050000\nRRULE:FREQ=MONTHLY;BYDAY=+2MO')
    const { getByText } = renderWithTheme(<EventDates event={event} languageCode={language} />)

    expect(getByText('Mo., 9. Okt. - Di., 10. Okt.', { exact: false })).toBeTruthy()
    expect(getByText('events:furtherDates')).toBeTruthy()
  })

  it('should reveal the upcoming dates when expanding a monthly recurring event', async () => {
    const event = eventWithDate('DTSTART:20230414T050000\nRRULE:FREQ=MONTHLY;BYDAY=+2MO')
    const { getByRole, getByText } = renderWithTheme(<EventDates event={event} languageCode={language} compact />)

    expect(getByText('events:furtherDates')).toBeTruthy()
    expect(getByText('Mo., 13. Nov. - Di., 14. Nov.')).not.toBeVisible()

    fireEvent.click(getByRole('button'))

    await waitFor(() => expect(getByText('Mo., 13. Nov. - Di., 14. Nov.')).toBeVisible())
    expect(getByText('Mo., 11. Dez. - Di., 12. Dez.')).toBeVisible()
    expect(getByText('Mo., 8. Jan. 2024 - Di., 9. Jan. 2024')).toBeVisible()
    expect(getByText('Mo., 12. Feb. 2024 - Di., 13. Feb. 2024')).toBeVisible()
    expect(getByText('Mo., 11. März 2024 - Di., 12. März 2024')).toBeVisible()
    expect(getByText('…')).toBeVisible()
  })

  it('should reveal the upcoming dates when expanding a weekly recurring event', async () => {
    const event = eventWithDate('DTSTART:20230414T050000\nRRULE:FREQ=WEEKLY;BYDAY=MO')
    const { getByRole, getByText } = renderWithTheme(<EventDates event={event} languageCode={language} compact />)

    fireEvent.click(getByRole('button'))

    await waitFor(() => expect(getByText('Mo., 16. Okt. - Di., 17. Okt.')).toBeVisible())
    expect(getByText('Mo., 13. Nov. - Di., 14. Nov.')).toBeVisible()
    expect(getByText('…')).toBeVisible()
  })

  it('should reveal fewer dates in compact format on mobile', async () => {
    mocked(useDimensions).mockImplementation(() => ({ ...mockDimensions, mobile: true }))
    const event = eventWithDate('DTSTART:20230414T050000\nRRULE:FREQ=MONTHLY;BYDAY=+2MO')
    const { getByRole, getByText, queryByText } = renderWithTheme(
      <EventDates event={event} languageCode={language} compact />,
    )

    fireEvent.click(getByRole('button'))

    await waitFor(() => expect(getByText('Mo., 8. Jan. 2024 - Di., 9. Jan. 2024')).toBeVisible())
    expect(queryByText('Mo., 12. Feb. 2024 - Di., 13. Feb. 2024')).toBeFalsy()
    expect(getByText('…')).toBeVisible()
  })

  it('should show each further date with its own time when times vary', async () => {
    mocked(useDimensions).mockImplementation(() => ({ ...mockDimensions, mobile: true }))
    const event = eventWithDate(
      'DTSTART:20231016T050000\nRDATE:20231016T050000\nRDATE:20231018T090000\nRDATE:20231020T130000',
    )
    const { getByRole, getByText } = renderWithTheme(<EventDates event={event} languageCode={language} />)

    fireEvent.click(getByRole('button'))

    await waitFor(() => expect(getByText(/Mi\., 18\. Okt\. - Do\., 19\. Okt\..*9:00 - 11:00/)).toBeVisible())
    expect(getByText(/Fr\., 20\. Okt\. - Sa\., 21\. Okt\..*13:00 - 15:00/)).toBeVisible()
  })
})
