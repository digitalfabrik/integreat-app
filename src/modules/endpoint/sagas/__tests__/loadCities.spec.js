// @flow

import { runSaga } from 'redux-saga'
import DefaultDataContainer from '../../DefaultDataContainer'
import loadCities from '../loadCities'
import RNFetchBlob from '../../../../__mocks__/rn-fetch-blob'
import CityModelBuilder from '../../../../testing/builder/CitiyModelBuilder'

let mockCities
jest.mock('rn-fetch-blob')
jest.mock('@integreat-app/integreat-api-client/endpoints/createCitiesEndpoint',
  () => () => {
    const { EndpointBuilder } = require('@integreat-app/integreat-api-client')
    const CityModelBuilder = require('../../../../testing/builder/CitiyModelBuilder').default
    mockCities = new CityModelBuilder(1).build()

    return new EndpointBuilder('cities-mock')
      .withParamsToUrlMapper(() => 'https://cms.integreat-app.de/sites')
      .withResponseOverride(mockCities)
      .withMapper(() => { })
      .build()
  }
)

describe('loadCities', () => {
  beforeEach(() => {
    RNFetchBlob.fs._reset()
  })

  const otherCities = new CityModelBuilder(2).build()

  it('should fetch and set cities if cities are not available', async () => {
    const dataContainer = new DefaultDataContainer()

    await runSaga({}, loadCities, dataContainer, false).toPromise()

    expect(await dataContainer.getCities()).toStrictEqual(mockCities)
  })

  it('should fetch and set cities if it should update', async () => {
    const dataContainer = new DefaultDataContainer()
    await dataContainer.setCities(otherCities)

    await runSaga({}, loadCities, dataContainer, true).toPromise()

    expect(await dataContainer.getCities()).toStrictEqual(mockCities)
  })

  it('should use cached cities if they are available and should not update', async () => {
    const dataContainer = new DefaultDataContainer()
    await dataContainer.setCities(otherCities)
    await runSaga({}, loadCities, dataContainer, false).toPromise()

    expect(await dataContainer.getCities()).toBe(otherCities)
  })
})
