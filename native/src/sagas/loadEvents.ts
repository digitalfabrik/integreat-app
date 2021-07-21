import { createEventsEndpoint, EventModel } from 'api-client'
import { call, SagaGenerator } from 'typed-redux-saga'
import { DataContainer } from '../utils/DataContainer'
import { determineApiUrl } from '../utils/helpers'

function* loadEvents(
  city: string,
  language: string,
  eventsEnabled: boolean,
  dataContainer: DataContainer,
  forceRefresh: boolean
): SagaGenerator<Array<EventModel>> {
  const eventsAvailable = yield* call(dataContainer.eventsAvailable, city, language)

  if (eventsAvailable && !forceRefresh) {
    try {
      console.debug('Using cached events')
      return yield* call(dataContainer.getEvents, city, language)
    } catch (e) {
      console.warn('An error occurred while loading events from JSON', e)
    }
  }

  if (!eventsEnabled) {
    console.debug('Events disabled')
    yield* call(dataContainer.setEvents, city, language, [])
    return []
  }

  console.debug('Fetching events')
  const apiUrl = yield* call(determineApiUrl)
  const payload = yield* call(() =>
    createEventsEndpoint(apiUrl).request({
      city,
      language
    })
  )
  const events = payload.data
  if (!events) {
    throw new Error('Events are not available')
  }
  yield* call(dataContainer.setEvents, city, language, events)
  return events
}

export default loadEvents
