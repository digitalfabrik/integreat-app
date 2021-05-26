import { DataContainer } from '../../DataContainer'
import { EventModel, PoiModel } from 'api-client'
import { call, StrictEffect } from 'redux-saga/effects'

export default function* loadPois(
  city: string,
  language: string,
  poisEnabled: boolean,
  dataContainer: DataContainer,
  forceRefresh: boolean
): Generator<StrictEffect, Array<PoiModel>, boolean | Array<PoiModel>> {
  const poisAvailable = yield call(() => dataContainer.poisAvailable(city, language))

  if (!poisAvailable || forceRefresh) {
    if (city === 'augsburg' && language === 'en') {
      return (yield call(dataContainer.getPois, city, language)) as Array<PoiModel>
    } else {
      throw new Error('When using this mock you should prepare the DataContainer with "augsburg" and language "en"!')
    }
  }

  return (yield call(dataContainer.getPois, city, language)) as Array<PoiModel>
}
