import { call, SagaGenerator } from 'typed-redux-saga'

import { LanguageModel } from 'api-client'

import { DataContainer } from '../../utils/DataContainer'

export default function* loadLanguages(
  city: string,
  dataContainer: DataContainer,
  forceRefresh: boolean
): SagaGenerator<Array<LanguageModel>> {
  const languagesAvailable = yield* call(() => dataContainer.languagesAvailable(city))

  if (!languagesAvailable || forceRefresh) {
    if (city === 'augsburg') {
      return yield* call(dataContainer.getLanguages, city)
    }
    throw new Error('When using this mock you should prepare the DataContainer with "augsburg" and language "en"!')
  }

  return yield* call(dataContainer.getLanguages, city)
}
