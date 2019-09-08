// @flow

import RNFetchBlob from '../../../../__mocks__/rn-fetch-blob'
import { CityModel } from '@integreat-app/integreat-api-client'
import DefaultDataContainer from '../../DefaultDataContainer'
import watchFetchCities, { fetchCities } from '../watchFetchCities'
import type { FetchCitiesActionType } from '../../../app/StoreActionType'
import { expectSaga, testSaga } from 'redux-saga-test-plan'

jest.mock('rn-fetch-blob')
let mockCreateCitiesEndpoint
jest.mock('@integreat-app/integreat-api-client/endpoints/createCitiesEndpoint',
  () => {
    mockCreateCitiesEndpoint = jest.fn(() => {
      const { CityModel, EndpointBuilder } = require('@integreat-app/integreat-api-client')

      return new EndpointBuilder('cities-mock')
        .withParamsToUrlMapper(() => 'https://cms.integreat-app.de/sites')
        .withResponseOverride([new CityModel({
          name: 'Stadt Augsburg',
          code: 'augsburg',
          live: true,
          eventsEnabled: true,
          extrasEnabled: true,
          sortingName: 'Augsburg',
          prefix: 'Stadt'
        })])
        .withMapper(() => { })
        .build()
    })
    return mockCreateCitiesEndpoint
  }
)

describe('watchFetchCities', () => {
  beforeEach(() => {
    RNFetchBlob.fs._reset()
  })

  const cities = [
    new CityModel({
      name: 'Stadt Augsburg',
      code: 'augsburg',
      live: true,
      eventsEnabled: true,
      extrasEnabled: true,
      sortingName: 'Augsburg',
      prefix: 'Stadt'
    })
  ]

  describe('fetchCities', () => {
    it('should yield an action which pushes the cites', () => {
      const dataContainer = new DefaultDataContainer()
      const action: FetchCitiesActionType = {
        type: 'FETCH_CITIES', params: { forceRefresh: false }
      }

      return expectSaga(fetchCities, dataContainer, action)
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
