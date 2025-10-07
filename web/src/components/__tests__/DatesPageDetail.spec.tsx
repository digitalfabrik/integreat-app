import { fireEvent } from '@testing-library/react'
import { DateTime } from 'luxon'
import React from 'react'
import { rrulestr } from 'rrule'

import { DateModel } from 'shared/api'

import { renderWithTheme } from '../../testing/render'
import DatesPageDetail from '../DatesPageDetail'

jest.mock('react-i18next')

jest.useFakeTimers({ now: new Date('2023-10-09T15:23:57.443+02:00') })
describe('DatesPageDetail', () => {
  const renderDatesPageDetail = (date: DateModel) => renderWithTheme(<DatesPageDetail date={date} languageCode='de' />)
  const date = (rrule?: string) =>
    new DateModel({
      startDate: DateTime.fromISO('2023-10-09T07:00:00.000+02:00'),
      endDate: DateTime.fromISO('2023-10-10T09:00:00.000+02:00'),
      allDay: false,
      recurrenceRule: rrule ? rrulestr(rrule) : null,
    })

  it('should render next date if no recurrences', () => {
    const { getByText, queryByText, queryByRole } = renderDatesPageDetail(date())

    expect(getByText('events:date_one', { exact: false })).toBeVisible()
    expect(getByText('9. Oktober 2023 07:00 - 10. Oktober 2023 09:00')).toBeVisible()
    expect(queryByText('...')).toBeFalsy()
    expect(queryByRole('button')).toBeFalsy()
  })

  it('should render only next dates if up to MAX_DATE_RECURRENCES_COLLAPSED recurrences', () => {
    const { getByText, queryByText, queryByRole } = renderDatesPageDetail(
      date('DTSTART:20230414T050000\nRRULE:FREQ=WEEKLY;BYDAY=MO;UNTIL=20231029T050000'),
    )

    expect(getByText('events:date_other', { exact: false })).toBeVisible()
    expect(getByText('9. Oktober 2023 07:00 - 10. Oktober 2023 09:00')).toBeVisible()
    expect(getByText('16. Oktober 2023 07:00 - 17. Oktober 2023 09:00')).toBeVisible()
    expect(getByText('23. Oktober 2023 07:00 - 24. Oktober 2023 09:00')).toBeVisible()
    expect(queryByText('...')).toBeFalsy()
    expect(queryByRole('button')).toBeFalsy()
  })

  it('should render next dates and accordion if up to MAX_DATE_RECURRENCES events and expand on click', () => {
    const { getByText, queryByText, getByRole } = renderDatesPageDetail(
      date('DTSTART:20230414T050000\nRRULE:FREQ=WEEKLY;BYDAY=MO;UNTIL=20231213T050000'),
    )

    expect(getByText('events:date_other', { exact: false })).toBeVisible()
    expect(getByText('9. Oktober 2023 07:00 - 10. Oktober 2023 09:00')).toBeVisible()
    expect(getByText('16. Oktober 2023 07:00 - 17. Oktober 2023 09:00')).toBeVisible()
    expect(getByText('23. Oktober 2023 07:00 - 24. Oktober 2023 09:00')).toBeVisible()
    expect(getByText('30. Oktober 2023 07:00 - 31. Oktober 2023 09:00')).not.toBeVisible()
    expect(getByText('11. Dezember 2023 07:00 - 12. Dezember 2023 09:00')).not.toBeVisible()

    expect(getByRole('button')).toBeVisible()
    fireEvent.click(getByRole('button'))

    expect(getByText('30. Oktober 2023 07:00 - 31. Oktober 2023 09:00')).toBeVisible()
    expect(getByText('11. Dezember 2023 07:00 - 12. Dezember 2023 09:00')).toBeVisible()
    expect(queryByText('...')).toBeFalsy()
    expect(queryByText('18. Dezember 2023 07:00 - 19. Dezember 2023 09:00')).toBeFalsy()
  })

  it('should render next dates and show accordion if more than MAX_DATE_RECURRENCES events and expand on click', () => {
    const { getByText, queryByText, getByRole } = renderDatesPageDetail(
      date('DTSTART:20230414T050000\nRRULE:FREQ=WEEKLY;BYDAY=MO;UNTIL=20241213T050000'),
    )

    expect(getByText('events:nextDate_other', { exact: false })).toBeVisible()
    expect(getByText('9. Oktober 2023 07:00 - 10. Oktober 2023 09:00')).toBeVisible()
    expect(getByText('16. Oktober 2023 07:00 - 17. Oktober 2023 09:00')).toBeVisible()
    expect(getByText('23. Oktober 2023 07:00 - 24. Oktober 2023 09:00')).toBeVisible()
    expect(getByText('30. Oktober 2023 07:00 - 31. Oktober 2023 09:00')).not.toBeVisible()
    expect(getByText('11. Dezember 2023 07:00 - 12. Dezember 2023 09:00')).not.toBeVisible()
    expect(getByText('...')).not.toBeVisible()

    expect(getByRole('button')).toBeVisible()
    fireEvent.click(getByRole('button'))

    expect(getByText('30. Oktober 2023 07:00 - 31. Oktober 2023 09:00')).toBeVisible()
    expect(getByText('11. Dezember 2023 07:00 - 12. Dezember 2023 09:00')).toBeVisible()
    expect(getByText('...')).toBeVisible()

    expect(queryByText('18. Dezember 2023 07:00 - 19. Dezember 2023 09:00')).toBeFalsy()
  })
})
