import RNFetchBlob from '../../../../__mocks__/rn-fetch-blob'
import DefaultDataContainer from '../../DefaultDataContainer'
import watchFetchCities, { fetchCities } from '../watchFetchCities'
import { FetchCitiesActionType } from '../../../app/StoreActionType'
import { expectSaga, testSaga } from 'redux-saga-test-plan'
import loadCities from '../loadCities'
import CityModelBuilder from 'api-client/src/testing/CityModelBuilder'
import { ErrorCode } from '../../../error/ErrorCodes'
jest.mock('rn-fetch-blob')
jest.mock('../loadCities')
describe('watchFetchCities', () => {
  beforeEach(() => {
    RNFetchBlob.fs._reset()
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
      return expectSaga(fetchCities, dataContainer, action)
        .call(loadCities, dataContainer, false)
        .put({
          type: 'PUSH_CITIES',
          params: {
            cities
          }
        })
        .run()
    })
    it('should put an error action', () => {
      const dataContainer = new DefaultDataContainer()
      const action: FetchCitiesActionType = {
        type: 'FETCH_CITIES',
        params: {
          forceRefresh: false
        }
      }
      return expectSaga(fetchCities, dataContainer, action)
        .provide({
          call: (effect, next) => {
            if (effect.fn === loadCities) {
              throw new Error('Jemand hat keine 4 Issues geschafft!')
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
    })
  })
  it('should correctly call fetchCities when triggered', async () => {
    const dataContainer = new DefaultDataContainer()
    return testSaga(watchFetchCities, dataContainer).next().takeLatest('FETCH_CITIES', fetchCities, dataContainer)
  })
})
