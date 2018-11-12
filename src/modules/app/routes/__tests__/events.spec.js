// @flow

import eventsRoute from '../events'

describe('events route', () => {
  it('should create the right path', () => {
    const city = 'augsburg'
    const language = 'de'
    expect(eventsRoute.getRoutePath({city, language})).toBe('/augsburg/de/events')
  })

  it('should have the right path', () => {
    expect(eventsRoute.route).toBe('/:city/:language/events/:eventId?')
  })
})
