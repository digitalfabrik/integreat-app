// @flow

import RNFetchBlob from '../../../../__mocks__/rn-fetch-blob'
import DefaultDataContainer from '../../DefaultDataContainer'
import watchFetchCities, { fetchCities } from '../watchFetchCities'
import type { FetchCitiesActionType } from '../../../app/StoreActionType'
import { expectSaga, testSaga } from 'redux-saga-test-plan'
import loadCities from '../loadCities'
import CityModelBuilder from '../../../../testing/builder/CitiyModelBuilder'

let mockCreateCitiesEndpoint
jest.mock('rn-fetch-blob')
jest.mock('@integreat-app/integreat-api-client/endpoints/createCitiesEndpoint',
  () => {
    const implementation = () => {
      const { EndpointBuilder } = require('@integreat-app/integreat-api-client')
      const CityModelBuilder = require('../../../../testing/builder/CitiyModelBuilder').default
      const cities = new CityModelBuilder(1).build()

      return new EndpointBuilder('cities-mock')
        .withParamsToUrlMapper(() => 'https://cms.integreat-app.de/sites')
        .withResponseOverride(cities)
        .withMapper(() => { })
        .build()
    }
    implementation()
    mockCreateCitiesEndpoint = jest.fn(implementation)
    return mockCreateCitiesEndpoint
  }
)

describe('watchFetchCities', () => {
  beforeEach(() => {
    RNFetchBlob.fs._reset()
  })

  describe('fetchCities', () => {
    it('should yield an action which pushes the cites', () => {
      const cities = new CityModelBuilder(1).build()

      const dataContainer = new DefaultDataContainer()
      const action: FetchCitiesActionType = {
        type: 'FETCH_CITIES', params: { forceRefresh: false }
      }

      return expectSaga(fetchCities, dataContainer, action)
        .call(loadCities, dataContainer, false)
        .put({ type: 'PUSH_CITIES', params: { cities } })
        .run()
    })

    it('should yield an error action', () => {
      mockCreateCitiesEndpoint.mockImplementation(() => { throw Error('Jemand hat keine 4 Issues geschafft!') })
      const dataContainer = new DefaultDataContainer()
      const action: FetchCitiesActionType = {
        type: 'FETCH_CITIES',
        params: { forceRefresh: false }
      }

      return expectSaga(fetchCities, dataContainer, action)
        .call(loadCities, dataContainer, false)
        .put({
          type: 'FETCH_CITIES_FAILED',
          params: { message: 'Error in fetchCities: Jemand hat keine 4 Issues geschafft!' }
        })
        .run()
    })
  })

  it('should correctly call fetchCities when triggered', async () => {
    const dataContainer = new DefaultDataContainer()

    return testSaga(watchFetchCities, dataContainer)
      .next()
      .takeLatest('FETCH_CITIES', fetchCities, dataContainer)
  })
})
