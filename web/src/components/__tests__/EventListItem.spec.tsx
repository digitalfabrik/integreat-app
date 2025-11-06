import { DateTime } from 'luxon'
import React from 'react'
import { rrulestr } from 'rrule'

import { getExcerpt } from 'shared'
import { EventModelBuilder, DateModel } from 'shared/api'

import { EventThumbnailPlaceholder1, EventThumbnailPlaceholder2, EventThumbnailPlaceholder3 } from '../../assets'
import { EXCERPT_MAX_CHARS } from '../../constants'
import { renderWithRouterAndTheme } from '../../testing/render'
import EventListItem, { getDateIcon } from '../EventListItem'

jest.mock('react-i18next')
jest.mock(
  '@mui/material/Tooltip',
  () =>
    ({ title }: { title: string }) =>
      title,
)

jest.useFakeTimers({ now: new Date('2023-10-02T05:23:57.443+02:00') })
describe('EventListItem', () => {
  const language = 'de'

  const event = new EventModelBuilder('seed', 1, 'augsburg', language).build()[0]!
  const excerpt = getExcerpt(event.excerpt, { maxChars: EXCERPT_MAX_CHARS })

  it('should show event list item with specific thumbnail', () => {
    const { getByText, getByRole } = renderWithRouterAndTheme(<EventListItem event={event} languageCode={language} />)

    expect(getByText(event.title)).toBeTruthy()
    expect(
      getByText(event.date.formatEventDateInOneLine(language, jest.fn()), { collapseWhitespace: false }),
    ).toBeTruthy()
    expect(getByText(event.location!.name)).toBeTruthy()
    expect(getByRole('presentation')).toHaveProperty('src', event.thumbnail)
    expect(getByText(excerpt)).toBeTruthy()
  })

  it('should show event list item with placeholder thumbnail', () => {
    const eventWithoutThumbnail = Object.assign(event, { _thumbnail: undefined })

    const { getByText, getByRole } = renderWithRouterAndTheme(
      <EventListItem event={eventWithoutThumbnail} languageCode={language} />,
    )

    expect(getByText(event.title)).toBeTruthy()
    expect(
      getByText(event.date.formatEventDateInOneLine(language, jest.fn()), { collapseWhitespace: false }),
    ).toBeTruthy()
    const src = (getByRole('presentation') as HTMLMediaElement).src
    expect(
      [EventThumbnailPlaceholder1, EventThumbnailPlaceholder2, EventThumbnailPlaceholder3].some(img =>
        src.endsWith(img),
      ),
    ).toBeTruthy()
    expect(getByText(excerpt)).toBeTruthy()
  })

  describe('date icon', () => {
    const createEvent = (rrule?: string) =>
      Object.assign(event, {
        _date: new DateModel({
          startDate: DateTime.fromISO('2023-10-09T07:00:00.000+02:00'),
          endDate: DateTime.fromISO('2023-10-10T09:00:00.000+02:00'),
          allDay: false,
          recurrenceRule: rrule ? rrulestr(rrule) : null,
          onlyWeekdays: false,
        }),
      })

    it('should show no icon if neither recurring nor today', () => {
      const event = createEvent()
      expect(getDateIcon(event.date)?.tooltip).toBeUndefined()

      const { queryByText } = renderWithRouterAndTheme(<EventListItem event={event} languageCode={language} />)

      expect(queryByText('events:todayRecurring')).toBeFalsy()
      expect(queryByText('events:recurring')).toBeFalsy()
      expect(queryByText('events:today')).toBeFalsy()
    })

    it('should show icon if recurring and today', () => {
      const event = createEvent('DTSTART:20230414T050000\nRRULE:FREQ=WEEKLY;BYDAY=MO;UNTIL=20231029T050000')

      const { queryByText, debug } = renderWithRouterAndTheme(<EventListItem event={event} languageCode={language} />)
      debug()

      expect(queryByText('events:todayRecurring')).toBeTruthy()
      expect(queryByText('events:recurring')).toBeFalsy()
      expect(queryByText('events:today')).toBeFalsy()
    })

    it('should show icon if recurring but not today', () => {
      const event = createEvent('DTSTART:20230414T050000\nRRULE:FREQ=WEEKLY;BYDAY=TU;UNTIL=20231029T050000')

      const { queryByText, getByText } = renderWithRouterAndTheme(
        <EventListItem event={event} languageCode={language} />,
      )

      expect(queryByText('events:todayRecurring')).toBeFalsy()
      expect(getByText('events:recurring')).toBeTruthy()
      expect(queryByText('events:today')).toBeFalsy()
    })

    it('should show icon if today but not recurring', () => {
      const event = createEvent('DTSTART:20230414T050000\nRRULE:FREQ=WEEKLY;BYDAY=MO;UNTIL=20231003T050000')

      const { queryByText, getByText } = renderWithRouterAndTheme(
        <EventListItem event={event} languageCode={language} />,
      )

      expect(queryByText('events:todayRecurring')).toBeFalsy()
      expect(queryByText('events:recurring')).toBeFalsy()
      expect(getByText('events:today')).toBeTruthy()
    })
  })
})
