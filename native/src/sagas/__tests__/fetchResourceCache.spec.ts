import { expectSaga } from 'redux-saga-test-plan'

import { ErrorCode } from 'api-client'
import CategoriesMapModelBuilder from 'api-client/src/testing/CategoriesMapModelBuilder'

import BlobUtil from '../../__mocks__/react-native-blob-util'
import { createFetchMap } from '../../testing/builder/util'
import DefaultDataContainer from '../../utils/DefaultDataContainer'
import FetcherModule from '../../utils/FetcherModule'
import { log, reportError } from '../../utils/sentry'
import fetchResourceCache from '../fetchResourceCache'

jest.mock('../../utils/sentry')
jest.mock('../../utils/FetcherModule')

describe('fetchResourceCache', () => {
  beforeEach(() => {
    BlobUtil.fs._reset()
    jest.clearAllMocks()
  })
  const city = 'augsburg'
  const language = 'en'

  it('should fetch and create warning message', async () => {
    const dataContainer = new DefaultDataContainer()
    const categoriesBuilder = new CategoriesMapModelBuilder(city, language)
    const resources = categoriesBuilder.buildResources()
    const fetchMap = createFetchMap(resources)
    await expectSaga(fetchResourceCache, city, language, fetchMap, dataContainer)
      .not.put.like({
        action: {
          type: 'FETCH_RESOURCES_FAILED',
        },
      })
      .run()
    const fetchedResources = await dataContainer.getResourceCache(city, language)
    const fetchedCount = {
      ...fetchedResources['/augsburg/en/category_0'],
      ...fetchedResources['/augsburg/en/category_0/category_0'],
    }
    const expectedCount = {
      ...resources['/augsburg/en/category_0'],
      ...resources['/augsburg/en/category_0/category_0'],
    }
    expect(Object.keys(fetchedCount)).toHaveLength(
      Object.keys(expectedCount).length - 1
      /* A single url is excluded because the
                                         FetcherModule mock produced an error for it */
    )
    expect(log).toHaveBeenCalledWith(expect.stringContaining('Failed to download'))
    expect(reportError).not.toHaveBeenCalled()
  })

  it('should put error if fetching fails', async () => {
    const dataContainer = new DefaultDataContainer()
    const categoriesBuilder = new CategoriesMapModelBuilder(city, language)
    const fetchMap = createFetchMap(categoriesBuilder.buildResources())
    FetcherModule.currentlyFetching = true
    await expectSaga(fetchResourceCache, city, language, fetchMap, dataContainer)
      .put({
        type: 'FETCH_RESOURCES_FAILED',
        params: {
          message: 'Error in fetchResourceCache: Already fetching!',
          code: ErrorCode.UnknownError,
        },
      })
      .run()
    expect(reportError).toHaveBeenCalledTimes(1)
  })
})
