import { expectSaga, testSaga } from 'redux-saga-test-plan'

import { ErrorCode } from 'api-client'
import CityModelBuilder from 'api-client/src/testing/CityModelBuilder'

import RNFetchBlob from '../../__mocks__/rn-fetch-blob'
import { FetchCitiesActionType } from '../../redux/StoreActionType'
import DefaultDataContainer from '../../utils/DefaultDataContainer'
import { logError } from '../../utils/helpers'
import loadCities from '../loadCities'
import watchFetchCities, { fetchCities } from '../watchFetchCities'

jest.mock('../../utils/helpers')
jest.mock('../loadCities')

describe('watchFetchCities', () => {
  beforeEach(() => {
    RNFetchBlob.fs._reset()
    jest.clearAllMocks()
  })

  describe('fetchCities', () => {
    it('should put an action which pushes the cities', async () => {
      const cities = new CityModelBuilder(1).build()
      const dataContainer = new DefaultDataContainer()
      await dataContainer.setCities(cities)
      const action: FetchCitiesActionType = {
        type: 'FETCH_CITIES',
        params: {
          forceRefresh: false
        }
      }
      await expectSaga(fetchCities, dataContainer, action)
        .call(loadCities, dataContainer, false)
        .put({
          type: 'PUSH_CITIES',
          params: {
            cities
          }
        })
        .run()
      expect(logError).not.toHaveBeenCalled()
    })

    it('should put an error action', async () => {
      const dataContainer = new DefaultDataContainer()
      const action: FetchCitiesActionType = {
        type: 'FETCH_CITIES',
        params: {
          forceRefresh: false
        }
      }
      const error = new Error('Jemand hat keine 4 Issues geschafft!')
      await expectSaga(fetchCities, dataContainer, action)
        .provide({
          call: (effect, next) => {
            if (effect.fn === loadCities) {
              throw error
            }

            return next()
          }
        })
        .call(loadCities, dataContainer, false)
        .put({
          type: 'FETCH_CITIES_FAILED',
          params: {
            message: 'Error in fetchCities: Jemand hat keine 4 Issues geschafft!',
            code: ErrorCode.UnknownError
          }
        })
        .run()
      expect(logError).toHaveBeenCalledTimes(1)
      expect(logError).toHaveBeenCalledWith(error)
    })
  })

  it('should correctly call fetchCities when triggered', async () => {
    const dataContainer = new DefaultDataContainer()
    await testSaga(watchFetchCities, dataContainer).next().takeLatest('FETCH_CITIES', fetchCities, dataContainer)
    expect(logError).not.toHaveBeenCalled()
  })
})
