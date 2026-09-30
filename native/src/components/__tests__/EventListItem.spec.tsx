import { DateTime } from 'luxon'
import React from 'react'
import { rrulestr } from 'rrule'

import { MAX_DAYS_NEW } from 'shared'
import { DateModel, EventModelBuilder } from 'shared/api'
import { mockT } from 'shared/testing'

import TestingAppContext from '../../testing/TestingAppContext'
import render from '../../testing/render'
import EventListItem from '../EventListItem'

jest.useFakeTimers({ now: new Date('2023-10-02T05:23:57.443+02:00') })
describe('EventListItem', () => {
  const language = 'de'
  const regionCode = 'augsburg'

  const event = new EventModelBuilder('seed', 1, 'augsburg', language).build()[0]!
  const navigateToEvent = jest.fn()

  it('should show event list item with specific thumbnail', () => {
    const { getByText } = render(
      <EventListItem event={event} language={language} regionCode={regionCode} navigateTo={navigateToEvent} />,
    )

    expect(getByText(event.title)).toBeTruthy()
    expect(getByText(event.date.formatDateInterval(language))).toBeTruthy()
    expect(getByText(event.date.formatTimeInterval(language, { t: mockT }))).toBeTruthy()
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

      const { queryByLabelText } = render(
        <EventListItem event={event} language={language} regionCode={regionCode} navigateTo={navigateToEvent} />,
      )

      expect(queryByLabelText('events:recurrence.recurring')).toBeFalsy()
    })

    it('should show icon if recurring event', () => {
      const event = createEvent('DTSTART:20230414T050000\nRRULE:FREQ=WEEKLY;BYDAY=MO;UNTIL=20231029T050000')

      const { queryByLabelText } = render(
        <EventListItem event={event} language={language} regionCode={regionCode} navigateTo={navigateToEvent} />,
      )

      expect(queryByLabelText('events:recurrence.recurring')).toBeTruthy()
    })
  })

  describe('new chip', () => {
    const createEvent = (publishedDaysAgo: number) =>
      Object.assign(new EventModelBuilder('seed', 1, regionCode, language).build()[0]!, {
        _publishedAt: DateTime.now().minus({ days: publishedDaysAgo }),
      })

    const renderEventListItem = (event: ReturnType<typeof createEvent>, visitedEventIds = {}) =>
      render(
        <TestingAppContext settings={{ visitedEventIds }}>
          <EventListItem event={event} language={language} regionCode={regionCode} navigateTo={navigateToEvent} />
        </TestingAppContext>,
      )

    it('should show chip for new event which was not visited yet', () => {
      const { getByText } = renderEventListItem(createEvent(MAX_DAYS_NEW - 1))

      expect(getByText('common:state.new')).toBeTruthy()
    })

    it('should not show chip for new event which was already visited', () => {
      const event = createEvent(MAX_DAYS_NEW - 1)
      const { queryByText } = renderEventListItem(event, { [regionCode]: { [event.id]: DateTime.now().toISODate() } })

      expect(queryByText('common:state.new')).toBeFalsy()
    })

    it('should show chip for new event which was only visited in another region', () => {
      const event = createEvent(MAX_DAYS_NEW - 1)
      const { getByText } = renderEventListItem(event, { muenchen: { [event.id]: DateTime.now().toISODate() } })

      expect(getByText('common:state.new')).toBeTruthy()
    })

    it('should not show chip for old event', () => {
      const { queryByText } = renderEventListItem(createEvent(MAX_DAYS_NEW + 1))

      expect(queryByText('common:state.new')).toBeFalsy()
    })
  })
})
