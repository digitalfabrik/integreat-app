import { DataContainer } from '../../DataContainer'
import { Saga } from 'redux-saga'
import { EventModel } from 'api-client'
import { call } from 'redux-saga/effects'
export default function* loadPois(
  city: string,
  language: string,
  poisEnabled: boolean,
  dataContainer: DataContainer,
  forceRefresh: boolean
): Saga<Array<EventModel>> {
  const poisAvailable = yield call(() => dataContainer.poisAvailable(city, language))

  if (!poisAvailable || forceRefresh) {
    if (city === 'augsburg' && language === 'en') {
      return yield call(dataContainer.getEvents, city, language)
    } else {
      throw new Error('When using this mock you should prepare the DataContainer with "augsburg" and language "en"!')
    }
  }

  return yield call(dataContainer.getEvents, city, language)
}
