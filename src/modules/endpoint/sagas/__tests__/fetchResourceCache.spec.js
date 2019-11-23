// @flow

import { expectSaga } from 'redux-saga-test-plan'
import fetchResourceCache from '../fetchResourceCache'
import DefaultDataContainer from '../../DefaultDataContainer'
import RNFetchBlob from '../../../../__mocks__/rn-fetch-blob'
import CategoriesMapModelBuilder from '../../../../testing/builder/CategoriesMapModelBuilder'

jest.mock('../../../fetcher/FetcherModule')
jest.mock('rn-fetch-blob')

describe('fetchResourceCache', () => {
  beforeEach(() => {
    RNFetchBlob.fs._reset()
  })

  const city = 'augsburg'
  const language = 'en'

  it('should fetch and create warning message', async () => {
    const spy = jest.spyOn(console, 'warn')

    const dataContainer = new DefaultDataContainer()

    const categoriesBuilder = new CategoriesMapModelBuilder(city, language)
    const resources = categoriesBuilder.buildResources()
    const fetchMap = categoriesBuilder.buildFetchMap()

    await expectSaga(fetchResourceCache, city, language, fetchMap, dataContainer)
      .not.put.like({ action: { type: 'FETCH_RESOURCES_FAILED' } })
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
      Object.keys(expectedCount).length - 1 /* A single url is excluded because the
                                               FetcherModule mock produced an error for it */
    )

    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining('Failed to download')
    )

    spy.mockRestore()
  })

  it('should put error if fetching fails', () => {
    const dataContainer = new DefaultDataContainer()

    const categoriesBuilder = new CategoriesMapModelBuilder(city, language)
    const fetchMap = categoriesBuilder.buildFetchMap()

    return expectSaga(fetchResourceCache, city, language, fetchMap, dataContainer)
      .provide({
        call: (effect, next) => {
          if (effect.fn.name === 'fetchAsync') {
            throw new Error('Jemand hat keine 4 Issues geschafft!')
          }
          return next()
        }
      })
      .put({
        type: 'FETCH_RESOURCES_FAILED',
        params: { message: 'Error in fetchResourceCache: Jemand hat keine 4 Issues geschafft!' }
      })
      .run()
  })
})
