import { CityModel } from 'api-client'
import { call, StrictEffect } from 'redux-saga/effects'
import { DataContainer } from '../../DataContainer'

function* loadCities(
  dataContainer: DataContainer,
  forceRefresh: boolean
): Generator<StrictEffect, Array<CityModel>, boolean | Array<CityModel>> {
  const citiesAvailable = (yield call(() => dataContainer.citiesAvailable())) as boolean

  if (!citiesAvailable) {
    throw new Error('When using this mock you should prepare the DataContainer!')
  }

  return (yield call(dataContainer.getCities)) as Array<CityModel>
}

export default loadCities
