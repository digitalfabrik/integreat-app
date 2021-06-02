import { DataContainer } from '../../DataContainer'
import { LanguageModel } from 'api-client'
import { call, StrictEffect } from 'redux-saga/effects'

export default function* (
  city: string,
  dataContainer: DataContainer,
  forceRefresh: boolean
): Generator<StrictEffect, Array<LanguageModel>, boolean | Array<LanguageModel>> {
  const languagesAvailable = (yield call(() => dataContainer.languagesAvailable(city))) as boolean

  if (!languagesAvailable || forceRefresh) {
    if (city === 'augsburg') {
      return (yield call(dataContainer.getLanguages, city)) as Array<LanguageModel>
    } else {
      throw new Error('When using this mock you should prepare the DataContainer with "augsburg" and language "en"!')
    }
  }

  return (yield call(dataContainer.getLanguages, city)) as Array<LanguageModel>
}
