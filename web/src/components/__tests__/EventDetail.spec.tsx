import { DateTime } from 'luxon'
import React from 'react'

import { MAX_DAYS_NEW } from 'shared'
import { EventModelBuilder } from 'shared/api'

import { EVENTS_VISITED_IDS_STORAGE_KEY } from '../../hooks/useLocalStorage'
import { renderWithRouterAndTheme } from '../../testing/render'
import EventDetail from '../EventDetail'

jest.useFakeTimers({ now: new Date('2023-10-02T05:23:57.443+02:00') })

describe('EventDetail', () => {
  const language = 'de'
  const regionCode = 'augsburg'

  const createEvent = (publishedDaysAgo: number) =>
    Object.assign(new EventModelBuilder('seed', 1, regionCode, language).build()[0]!, {
      _publishedAt: DateTime.now().minus({ days: publishedDaysAgo }),
    })

  const getStoredVisitedIds = () => JSON.parse(localStorage.getItem(EVENTS_VISITED_IDS_STORAGE_KEY) ?? '{}')

  beforeEach(() => {
    localStorage.clear()
  })

  it('should show title and chip for new event on first visit', () => {
    const event = createEvent(MAX_DAYS_NEW - 1)

    const { getByRole, getByText } = renderWithRouterAndTheme(
      <EventDetail event={event} languageCode={language} regionCode={regionCode} />,
    )

    expect(getByRole('heading', { level: 1, name: event.title })).toBeTruthy()
    expect(getByText('common:state.new')).toBeTruthy()
  })

  it('should mark event as visited', () => {
    const event = createEvent(MAX_DAYS_NEW - 1)

    renderWithRouterAndTheme(<EventDetail event={event} languageCode={language} regionCode={regionCode} />)

    expect(getStoredVisitedIds()).toEqual({ [regionCode]: { [event.id]: DateTime.now().toISODate() } })
  })

  it('should keep visited events of other regions', () => {
    const event = createEvent(MAX_DAYS_NEW - 1)
    const otherRegionVisitedIds = { muenchen: { 42: DateTime.now().toISO() } }
    localStorage.setItem(EVENTS_VISITED_IDS_STORAGE_KEY, JSON.stringify(otherRegionVisitedIds))

    renderWithRouterAndTheme(<EventDetail event={event} languageCode={language} regionCode={regionCode} />)

    expect(getStoredVisitedIds()).toEqual({
      ...otherRegionVisitedIds,
      [regionCode]: { [event.id]: DateTime.now().toISODate() },
    })
  })

  it('should not show chip for new event which was already visited', () => {
    const event = createEvent(MAX_DAYS_NEW - 1)
    localStorage.setItem(
      EVENTS_VISITED_IDS_STORAGE_KEY,
      JSON.stringify({ [regionCode]: { [event.id]: DateTime.now().minus({ days: 1 }).toISO() } }),
    )

    const { queryByText } = renderWithRouterAndTheme(
      <EventDetail event={event} languageCode={language} regionCode={regionCode} />,
    )

    expect(queryByText('common:state.new')).toBeFalsy()
  })

  it('should not show chip for old event', () => {
    const event = createEvent(MAX_DAYS_NEW + 1)

    const { queryByText } = renderWithRouterAndTheme(
      <EventDetail event={event} languageCode={language} regionCode={regionCode} />,
    )

    expect(queryByText('common:state.new')).toBeFalsy()
  })
})
