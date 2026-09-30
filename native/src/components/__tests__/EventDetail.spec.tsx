import { DateTime } from 'luxon'
import React from 'react'

import { MAX_DAYS_NEW } from 'shared'
import { EventModelBuilder } from 'shared/api'

import TestingAppContext from '../../testing/TestingAppContext'
import render from '../../testing/render'
import { defaultSettings } from '../../utils/AppSettings'
import EventDetail from '../EventDetail'

jest.mock('../Page')

jest.useFakeTimers({ now: new Date('2023-10-02T05:23:57.443+02:00') })

describe('EventDetail', () => {
  const language = 'de'
  const regionCode = 'augsburg'
  const updateSettings = jest.fn()

  const createEvent = (publishedDaysAgo: number) =>
    Object.assign(new EventModelBuilder('seed', 1, regionCode, language).build()[0]!, {
      _publishedAt: DateTime.now().minus({ days: publishedDaysAgo }),
    })

  const renderEventDetail = (event: ReturnType<typeof createEvent>, visitedEventIds = {}) =>
    render(
      <TestingAppContext settings={{ visitedEventIds }} updateSettings={updateSettings}>
        <EventDetail event={event} language={language} regionCode={regionCode} />
      </TestingAppContext>,
    )

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should show title and chip for new event on first visit', () => {
    const event = createEvent(MAX_DAYS_NEW - 1)
    const { getByText } = renderEventDetail(event)

    expect(getByText(event.title)).toBeTruthy()
    expect(getByText('common:state.new')).toBeTruthy()
  })

  it('should mark event as visited and keep visited events of other regions', () => {
    const event = createEvent(MAX_DAYS_NEW - 1)
    const otherRegionVisitedIds = { muenchen: { 42: DateTime.now().toISODate() } }
    renderEventDetail(event)

    expect(updateSettings).toHaveBeenCalledTimes(1)
    const settingsUpdater = updateSettings.mock.calls[0][0]
    expect(settingsUpdater({ ...defaultSettings, visitedEventIds: otherRegionVisitedIds })).toEqual({
      visitedEventIds: { ...otherRegionVisitedIds, [regionCode]: { [event.id]: DateTime.now().toISODate() } },
    })
  })

  it('should not show chip for new event which was already visited', () => {
    const event = createEvent(MAX_DAYS_NEW - 1)
    const { queryByText } = renderEventDetail(event, {
      [regionCode]: { [event.id]: DateTime.now().minus({ days: 1 }).toISODate() },
    })

    expect(queryByText('common:state.new')).toBeFalsy()
  })

  it('should not show chip for old event', () => {
    const { queryByText } = renderEventDetail(createEvent(MAX_DAYS_NEW + 1))

    expect(queryByText('common:state.new')).toBeFalsy()
  })
})
