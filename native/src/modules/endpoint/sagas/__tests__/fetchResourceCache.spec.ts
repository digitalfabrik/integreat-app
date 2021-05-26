import { expectSaga } from 'redux-saga-test-plan'
import fetchResourceCache from '../fetchResourceCache'
import DefaultDataContainer from '../../DefaultDataContainer'
import RNFetchBlob from '../../../../__mocks__/rn-fetch-blob'
import { ErrorCode } from '../../../error/ErrorCodes'
import FetcherModule from '../../../fetcher/FetcherModule'
import { createFetchMap } from '../../../../testing/builder/util'
import CategoriesMapModelBuilder from 'api-client/src/testing/CategoriesMapModelBuilder'
jest.mock('../../../fetcher/FetcherModule')
jest.mock('rn-fetch-blob')
describe('fetchResourceCache', () => {
  beforeEach(() => {
    RNFetchBlob.fs._reset()
  })
  const city = 'augsburg'
  const language = 'en'
  it('should fetch and create warning message', async () => {
    const spy = jest.spyOn(console, 'log')
    const dataContainer = new DefaultDataContainer()
    const categoriesBuilder = new CategoriesMapModelBuilder(city, language)
    const resources = categoriesBuilder.buildResources()
    const fetchMap = createFetchMap(resources)
    await expectSaga(fetchResourceCache, city, language, fetchMap, dataContainer)
      .not.put.like({
        action: {
          type: 'FETCH_RESOURCES_FAILED'
        }
      })
      .run()
    const fetchedResources = await dataContainer.getResourceCache(city, language)
    const fetchedCount = {
      ...fetchedResources['/augsburg/en/category_0'],
      ...fetchedResources['/augsburg/en/category_0/category_0']
    }
    const expectedCount = {
      ...resources['/augsburg/en/category_0'],
      ...resources['/augsburg/en/category_0/category_0']
    }
    expect(Object.keys(fetchedCount)).toHaveLength(
      Object.keys(expectedCount).length - 1
      /* A single url is excluded because the
                                         FetcherModule mock produced an error for it */
    )
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('Failed to download'))
    spy.mockRestore()
  })
  it('should put error if fetching fails', () => {
    const dataContainer = new DefaultDataContainer()
    const categoriesBuilder = new CategoriesMapModelBuilder(city, language)
    const fetchMap = createFetchMap(categoriesBuilder.buildResources())
    FetcherModule.currentlyFetching = true
    return expectSaga(fetchResourceCache, city, language, fetchMap, dataContainer)
      .put({
        type: 'FETCH_RESOURCES_FAILED',
        params: {
          message: 'Error in fetchResourceCache: Already fetching!',
          code: ErrorCode.UnknownError
        }
      })
      .run()
  })
})
