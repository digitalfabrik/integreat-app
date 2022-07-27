import { call, SagaGenerator } from 'typed-redux-saga'

import { createEventsEndpoint, EventModel } from 'api-client'

import { DataContainer } from '../utils/DataContainer'
import { determineApiUrl } from '../utils/helpers'
import { log, reportError } from '../utils/sentry'

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
      log('Using cached events')
      return yield* call(dataContainer.getEvents, city, language)
    } catch (e) {
      log('An error occurred while loading events from JSON', 'error')
      reportError(e)
    }
  }

  if (!eventsEnabled) {
    log('Events disabled')
    yield* call(dataContainer.setEvents, city, language, [])
    return []
  }
  log('Fetching events')
  const apiUrl = yield* call(determineApiUrl)
  const payload = yield* call(() =>
    createEventsEndpoint(apiUrl).request({
      city,
      language,
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
