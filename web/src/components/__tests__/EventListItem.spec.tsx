import { DateTime } from 'luxon'
import React from 'react'
import { rrulestr } from 'rrule'

import { getExcerpt, MAX_DAYS_NEW } from 'shared'
import { DateModel, EventModelBuilder } from 'shared/api'
import { mockT } from 'shared/testing'

import { EventThumbnailPlaceholder1, EventThumbnailPlaceholder2, EventThumbnailPlaceholder3 } from '../../assets'
import { EXCERPT_MAX_CHARS } from '../../constants'
import { EVENTS_VISITED_IDS_STORAGE_KEY } from '../../hooks/useLocalStorage'
import { renderWithRouterAndTheme } from '../../testing/render'
import EventListItem from '../EventListItem'

jest.useFakeTimers({ now: new Date('2023-10-02T05:23:57.443+02:00') })
describe('EventListItem', () => {
  const language = 'de'

  const event = new EventModelBuilder('seed', 1, 'augsburg', language).build()[0]!
  const excerpt = getExcerpt(event.excerpt, { maxChars: EXCERPT_MAX_CHARS })

  it('should show event list item with specific thumbnail', () => {
    const { getByText, getByRole } = renderWithRouterAndTheme(
      <EventListItem event={event} languageCode={language} regionCode='augsburg' />,
    )

    expect(getByText(event.title)).toBeTruthy()
    expect(getByText(event.date.formatDateInterval(language), { exact: false })).toBeTruthy()
    expect(getByText(event.date.formatTimeInterval(language, { t: mockT }), { exact: false })).toBeTruthy()
    expect(getByText(event.location!.name)).toBeTruthy()
    expect(getByRole('presentation')).toHaveProperty('src', event.thumbnail)
    expect(getByText(excerpt)).toBeTruthy()
  })

  it('should show event list item with placeholder thumbnail', () => {
    const eventWithoutThumbnail = Object.assign(event, { _thumbnail: undefined })

    const { getByText, getByRole } = renderWithRouterAndTheme(
      <EventListItem event={eventWithoutThumbnail} languageCode={language} regionCode='augsburg' />,
    )

    expect(getByText(event.title)).toBeTruthy()
    expect(getByText(event.date.formatDateInterval(language), { exact: false })).toBeTruthy()
    expect(getByText(event.date.formatTimeInterval(language, { t: mockT }), { exact: false })).toBeTruthy()
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

    it('should show no icon for for one time event', () => {
      const event = createEvent()

      const { queryByLabelText } = renderWithRouterAndTheme(
        <EventListItem event={event} languageCode={language} regionCode='augsburg' />,
      )

      expect(queryByLabelText('events:recurrence.recurring')).toBeFalsy()
    })

    it('should show icon if recurring event', () => {
      const event = createEvent('DTSTART:20230414T050000\nRRULE:FREQ=WEEKLY;BYDAY=MO;UNTIL=20231029T050000')

      const { queryByLabelText } = renderWithRouterAndTheme(
        <EventListItem event={event} languageCode={language} regionCode='augsburg' />,
      )

      expect(queryByLabelText('events:recurrence.recurring')).toBeTruthy()
    })
  })

  describe('new chip', () => {
    const newEvent = Object.assign(new EventModelBuilder('seed', 1, 'augsburg', language).build()[0]!, {
      _publishedAt: DateTime.now().minus({ days: MAX_DAYS_NEW - 1 }),
    })

    beforeEach(() => {
      localStorage.clear()
    })

    it('should show chip for new event which was not visited yet', () => {
      const { getByText } = renderWithRouterAndTheme(
        <EventListItem event={newEvent} languageCode={language} regionCode='augsburg' />,
      )

      expect(getByText('common:state.new')).toBeTruthy()
    })

    it('should not show chip for new event which was already visited', () => {
      localStorage.setItem(
        EVENTS_VISITED_IDS_STORAGE_KEY,
        JSON.stringify({ augsburg: { [newEvent.id]: DateTime.now().toISO() } }),
      )

      const { queryByText } = renderWithRouterAndTheme(
        <EventListItem event={newEvent} languageCode={language} regionCode='augsburg' />,
      )

      expect(queryByText('common:state.new')).toBeFalsy()
    })

    it('should show chip for new event which was only visited in another region', () => {
      localStorage.setItem(
        EVENTS_VISITED_IDS_STORAGE_KEY,
        JSON.stringify({ muenchen: { [newEvent.id]: DateTime.now().toISO() } }),
      )

      const { getByText } = renderWithRouterAndTheme(
        <EventListItem event={newEvent} languageCode={language} regionCode='augsburg' />,
      )

      expect(getByText('common:state.new')).toBeTruthy()
    })

    it('should not show chip for old event', () => {
      const oldEvent = Object.assign(new EventModelBuilder('seed', 1, 'augsburg', language).build()[0]!, {
        _publishedAt: DateTime.now().minus({ days: MAX_DAYS_NEW + 1 }),
      })

      const { queryByText } = renderWithRouterAndTheme(
        <EventListItem event={oldEvent} languageCode={language} regionCode='augsburg' />,
      )

      expect(queryByText('common:state.new')).toBeFalsy()
    })
  })
})
