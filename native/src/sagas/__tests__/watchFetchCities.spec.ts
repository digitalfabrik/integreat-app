import { expectSaga, testSaga } from 'redux-saga-test-plan'

import { ErrorCode } from 'api-client'
import CityModelBuilder from 'api-client/src/testing/CityModelBuilder'

import BlobUtil from '../../__mocks__/react-native-blob-util'
import { FetchCitiesActionType } from '../../redux/StoreActionType'
import DefaultDataContainer from '../../utils/DefaultDataContainer'
import { reportError } from '../../utils/sentry'
import loadCities from '../loadCities'
import watchFetchCities, { fetchCities } from '../watchFetchCities'

jest.mock('../../utils/sentry')
jest.mock('../loadCities')

describe('watchFetchCities', () => {
  beforeEach(() => {
    BlobUtil.fs._reset()
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
          forceRefresh: false,
        },
      }
      await expectSaga(fetchCities, dataContainer, action)
        .call(loadCities, dataContainer, false)
        .put({
          type: 'PUSH_CITIES',
          params: {
            cities,
          },
        })
        .run()
      expect(reportError).not.toHaveBeenCalled()
    })

    it('should put an error action', async () => {
      const dataContainer = new DefaultDataContainer()
      const action: FetchCitiesActionType = {
        type: 'FETCH_CITIES',
        params: {
          forceRefresh: false,
        },
      }
      const error = new Error('Jemand hat keine 4 Issues geschafft!')
      await expectSaga(fetchCities, dataContainer, action)
        .provide({
          call: (effect, next) => {
            if (effect.fn === loadCities) {
              throw error
            }

            return next()
          },
        })
        .call(loadCities, dataContainer, false)
        .put({
          type: 'FETCH_CITIES_FAILED',
          params: {
            message: 'Error in fetchCities: Jemand hat keine 4 Issues geschafft!',
            code: ErrorCode.UnknownError,
          },
        })
        .run()
      expect(reportError).toHaveBeenCalledTimes(1)
      expect(reportError).toHaveBeenCalledWith(error)
    })
  })

  it('should correctly call fetchCities when triggered', () => {
    const dataContainer = new DefaultDataContainer()
    testSaga(watchFetchCities, dataContainer).next().takeLatest('FETCH_CITIES', fetchCities, dataContainer)
    expect(reportError).not.toHaveBeenCalled()
  })
})
