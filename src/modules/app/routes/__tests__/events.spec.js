// @flow

import { EVENTS_ROUTE, eventsRoute, goToEvents } from '../events'

describe('events route', () => {
  it('should create the right action', () => {
    const city = 'augsburg'
    const language = 'de'
    expect(goToEvents(city, language)).toEqual({
      type: EVENTS_ROUTE,
      payload: {
        city,
        language
      }
    })
  })

  it('should have the right path', () => {
    expect(eventsRoute).toBe('/:city/:language/events/:eventId?')
  })
})
