import { EVENTS_ROUTE, eventsRoute, goToEvents } from '../events'

describe('events route', () => {
  it('should create the right action', () => {
    const city = 'augsburg'
    const language = 'de'
    const eventId = '1234'
    expect(goToEvents(city, language, eventId)).toEqual({
      type: EVENTS_ROUTE,
      payload: {
        city,
        language,
        eventId
      }
    })
  })

  it('should have the right path', () => {
    expect(eventsRoute).toBe('/:city/:language/events/:eventId?')
  })
})
