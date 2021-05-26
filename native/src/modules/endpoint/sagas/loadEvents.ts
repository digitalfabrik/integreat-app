import { createEventsEndpoint, EventModel, Payload } from 'api-client'
import { SagaIterator } from 'redux-saga'
import { call } from 'redux-saga/effects'
import { DataContainer } from '../DataContainer'
import determineApiUrl from '../determineApiUrl'

function* loadEvents(
  city: string,
  language: string,
  eventsEnabled: boolean,
  dataContainer: DataContainer,
  forceRefresh: boolean
): SagaIterator<Array<EventModel>> {
  const eventsAvailable: boolean = yield call(() => dataContainer.eventsAvailable(city, language))

  if (eventsAvailable && !forceRefresh) {
    try {
      console.debug('Using cached events')
      return yield call(dataContainer.getEvents, city, language)
    } catch (e) {
      console.warn('An error occurred while loading events from JSON', e)
    }
  }

  if (!eventsEnabled) {
    console.debug('Events disabled')
    yield call(dataContainer.setEvents, city, language, [])
    return []
  }

  console.debug('Fetching events')
  const apiUrl: string = yield call(determineApiUrl)
  const payload: Payload<Array<EventModel>> = yield call(() =>
    createEventsEndpoint(apiUrl).request({
      city,
      language
    })
  )
  const events = payload.data
  if (!events) {
    throw new Error('Events are not available')
  }
  yield call(dataContainer.setEvents, city, language, events)
  return events
}

export default loadEvents
