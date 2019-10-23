// @flow

import type { DataContainer } from '../../DataContainer'
import type { Saga } from 'redux-saga'
import { LanguageModel } from '@integreat-app/integreat-api-client'
import { call } from 'redux-saga/effects'

export default function * (
  city: string,
  dataContainer: DataContainer,
  forceRefresh: boolean
): Saga<Array<LanguageModel>> {
  const languagesAvailable = yield call(() => dataContainer.languagesAvailable(city))
  if (!languagesAvailable || forceRefresh) {
    if (city === 'augsburg') {
      return yield call(dataContainer.getLanguages, city)
    } else {
      throw new Error('When using this mock you should prepare the DataContainer with "augsburg" and language "en"!')
    }
  }
  return yield call(dataContainer.getLanguages, city)
}
