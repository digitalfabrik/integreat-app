// @flow

import type { Saga } from 'redux-saga'
import { CityModel } from '@integreat-app/integreat-api-client'
import { call } from 'redux-saga/effects'
import type { DataContainer } from '../../DataContainer'

function * loadCities (
  dataContainer: DataContainer,
  forceRefresh: boolean
): Saga<Array<CityModel>> {
  const citiesAvailable = yield call(() => dataContainer.citiesAvailable())

  if (!citiesAvailable || forceRefresh) {
    throw new Error('When using this mock you should prepare the DataContainer!')
  }

  return yield call(dataContainer.getCities)
}

export default loadCities
