// @flow

import eventsRoute, { getEventsPath } from '../events'

describe('events route', () => {
  it('should create the right path', () => {
    const city = 'augsburg'
    const language = 'de'
    expect(getEventsPath({city, language})).toBe('/augsburg/de/events')
  })

  it('should have the right path', () => {
    expect(eventsRoute).toBe('/:city/:language/events/:eventId?')
  })
})
