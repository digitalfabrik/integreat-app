import { DataContainer } from '../../utils/DataContainer'
import { PoiModel } from 'api-client'
import { call, SagaGenerator } from 'typed-redux-saga'

export default function* loadPois(
  city: string,
  language: string,
  poisEnabled: boolean,
  dataContainer: DataContainer,
  forceRefresh: boolean
): SagaGenerator<Array<PoiModel>> {
  const poisAvailable = yield* call(() => dataContainer.poisAvailable(city, language))

  if (!poisAvailable || forceRefresh) {
    if (city === 'augsburg' && language === 'en') {
      return yield* call(dataContainer.getPois, city, language)
    } else {
      throw new Error('When using this mock you should prepare the DataContainer with "augsburg" and language "en"!')
    }
  }

  return yield* call(dataContainer.getPois, city, language)
}
