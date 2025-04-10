import { fireEvent } from '@testing-library/react-native'
import { DateTime } from 'luxon'
import React from 'react'
import { rrulestr } from 'rrule'

import { DateModel } from 'shared/api'

import render from '../../testing/render'
import DatesPageDetail from '../DatesPageDetail'

jest.mock('react-i18next')

jest.useFakeTimers({ now: new Date('2023-10-09T15:23:57.443+02:00') })
describe('DatesPageDetail', () => {
  const renderDatesPageDetail = (date: DateModel) => render(<DatesPageDetail date={date} languageCode='de' />)

  const date = (rrule?: string) =>
    new DateModel({
      startDate: DateTime.fromISO('2023-10-09T07:00:00.000+02:00'),
      endDate: DateTime.fromISO('2023-10-10T09:00:00.000+02:00'),
      allDay: false,
      recurrenceRule: rrule ? rrulestr(rrule) : null,
    })

  it('should render next date if no recurrences', () => {
    const { getByText, queryByText, queryByRole } = renderDatesPageDetail(date())

    expect(getByText('date_one', { exact: false })).toBeTruthy()
    expect(getByText('9.10.2023 07:00 - 10.10.2023 09:00', { exact: false })).toBeTruthy()
    expect(queryByText('...')).toBeFalsy()
    expect(queryByRole('button')).toBeFalsy()
  })

  it('should render only next dates if up to MAX_DATE_RECURRENCES_COLLAPSED recurrences', () => {
    const { getByText, queryByText, queryByRole } = renderDatesPageDetail(
      date('DTSTART:20230414T050000\nRRULE:FREQ=WEEKLY;BYDAY=MO;UNTIL=20231029T050000'),
    )

    expect(getByText('date_other', { exact: false })).toBeTruthy()
    expect(getByText('9.10.2023 07:00 - 10.10.2023 09:00')).toBeTruthy()
    expect(getByText('16.10.2023 07:00 - 17.10.2023 09:00')).toBeTruthy()
    expect(getByText('23.10.2023 07:00 - 24.10.2023 09:00')).toBeTruthy()
    expect(queryByText('...')).toBeFalsy()
    expect(queryByRole('button')).toBeFalsy()
  })

  it('should render next dates and show collapsible if up to MAX_DATE_RECURRENCES events and expand on press', () => {
    const { getByText, queryByText, getByLabelText } = renderDatesPageDetail(
      date('DTSTART:20230414T050000\nRRULE:FREQ=WEEKLY;BYDAY=MO;UNTIL=20231213T050000'),
    )

    expect(getByText('date_other', { exact: false })).toBeTruthy()
    expect(getByText('9.10.2023 07:00 - 10.10.2023 09:00')).toBeTruthy()
    expect(getByText('16.10.2023 07:00 - 17.10.2023 09:00')).toBeTruthy()
    expect(getByText('23.10.2023 07:00 - 24.10.2023 09:00')).toBeTruthy()
    expect(queryByText('30.10.2023 07:00 - 01. November 2023 09:00')).toBeFalsy()
    expect(queryByText('11.12.2023 07:00 - 12.12.2023 09:00')).toBeFalsy()

    expect(getByLabelText('showMore')).toBeTruthy()
    fireEvent.press(getByLabelText('showMore'))

    expect(getByText('30.10.2023 07:00 - 31.10.2023 09:00')).toBeTruthy()
    expect(getByText('11.12.2023 07:00 - 12.12.2023 09:00')).toBeTruthy()
    expect(queryByText('...')).toBeFalsy()
    expect(queryByText('18.12.2023 07:00 - 19.12.2023 09:00')).toBeFalsy()
  })

  it('should render next dates and show collapsible if more than MAX_DATE_RECURRENCES events and expand on press', () => {
    const { getByText, queryByText, getByLabelText } = renderDatesPageDetail(
      date('DTSTART:20230414T050000\nRRULE:FREQ=WEEKLY;BYDAY=MO;UNTIL=20241213T050000'),
    )

    expect(getByText('nextDate_other', { exact: false })).toBeTruthy()
    expect(getByText('9.10.2023 07:00 - 10.10.2023 09:00')).toBeTruthy()
    expect(getByText('16.10.2023 07:00 - 17.10.2023 09:00')).toBeTruthy()
    expect(getByText('23.10.2023 07:00 - 24.10.2023 09:00')).toBeTruthy()
    expect(queryByText('30.10.2023 07:00 - 01. November 2023 09:00')).toBeFalsy()
    expect(queryByText('11.12.2023 07:00 - 12.12.2023 09:00')).toBeFalsy()
    expect(queryByText('...')).toBeFalsy()

    expect(getByLabelText('showMore')).toBeTruthy()
    fireEvent.press(getByLabelText('showMore'))

    expect(getByText('30.10.2023 07:00 - 31.10.2023 09:00')).toBeTruthy()
    expect(getByText('11.12.2023 07:00 - 12.12.2023 09:00')).toBeTruthy()
    expect(getByText('...')).toBeTruthy()

    expect(queryByText('18.12.2023 07:00 - 19.12.2023 09:00')).toBeFalsy()
  })
})
