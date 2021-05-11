import { Saga } from 'redux-saga'
import { CityModel, createEventsEndpoint, EventModel, Payload } from 'api-client'
import { call, StrictEffect } from 'redux-saga/effects'
import { DataContainer } from '../DataContainer'
import determineApiUrl from '../determineApiUrl'

type GeneratorReturnType = Payload<Array<EventModel>> | Array<EventModel> | boolean | string

function* loadEvents(
  city: string,
  language: string,
  eventsEnabled: boolean,
  dataContainer: DataContainer,
  forceRefresh: boolean
): Generator<StrictEffect, Array<EventModel>, GeneratorReturnType> {
  const eventsAvailable = (yield call(() => dataContainer.eventsAvailable(city, language))) as boolean

  if (eventsAvailable && !forceRefresh) {
    try {
      console.debug('Using cached events')
      return (yield call(dataContainer.getEvents, city, language)) as Array<EventModel>
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
  const apiUrl = (yield call(determineApiUrl)) as string
  const payload = (yield call(() =>
    createEventsEndpoint(apiUrl).request({
      city,
      language
    })
  )) as Payload<Array<EventModel>>
  const events = payload.data
  if (!events) {
    throw new Error('Events are not available')
  }
  yield call(dataContainer.setEvents, city, language, events)
  return events
}

export default loadEvents
