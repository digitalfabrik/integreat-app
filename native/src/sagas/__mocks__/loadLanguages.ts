import { DataContainer } from '../../utils/DataContainer'
import { LanguageModel } from 'api-client'
import { call, SagaGenerator } from 'typed-redux-saga'

export default function* (
  city: string,
  dataContainer: DataContainer,
  forceRefresh: boolean
): SagaGenerator<Array<LanguageModel>> {
  const languagesAvailable = yield* call(() => dataContainer.languagesAvailable(city))

  if (!languagesAvailable || forceRefresh) {
    if (city === 'augsburg') {
      return yield* call(dataContainer.getLanguages, city)
    } else {
      throw new Error('When using this mock you should prepare the DataContainer with "augsburg" and language "en"!')
    }
  }

  return yield* call(dataContainer.getLanguages, city)
}
