import { DataContainer } from '../../DataContainer'
import { Saga } from 'redux-saga'
import { LanguageModel } from 'api-client'
import { call } from 'redux-saga/effects'
export default function* (
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
