import { DataContainer } from '../../DataContainer'
import { EventModel } from 'api-client'
import { call, StrictEffect } from 'redux-saga/effects'

export default function* loadEvents(
  city: string,
  language: string,
  eventsEnabled: boolean,
  dataContainer: DataContainer,
  forceRefresh: boolean
): Generator<StrictEffect, Array<EventModel>, boolean | Array<EventModel>> {
  const eventsAvailable = yield call(() => dataContainer.eventsAvailable(city, language))

  if (!eventsAvailable || forceRefresh) {
    if (city === 'augsburg' && language === 'en') {
      return (yield call(dataContainer.getEvents, city, language)) as Array<EventModel>
    } else {
      throw new Error('When using this mock you should prepare the DataContainer with "augsburg" and language "en"!')
    }
  }

  return (yield call(dataContainer.getEvents, city, language)) as Array<EventModel>
}
