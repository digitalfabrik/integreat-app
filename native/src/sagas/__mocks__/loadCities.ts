import { call, SagaGenerator } from 'typed-redux-saga'

import { CityModel } from 'api-client'

import { DataContainer } from '../../utils/DataContainer'

function* loadCities(dataContainer: DataContainer, _unusedForceRefresh: string): SagaGenerator<Array<CityModel>> {
  const citiesAvailable = yield* call(() => dataContainer.citiesAvailable())

  if (!citiesAvailable) {
    throw new Error('When using this mock you should prepare the DataContainer!')
  }

  return yield* call(dataContainer.getCities)
}

export default loadCities
