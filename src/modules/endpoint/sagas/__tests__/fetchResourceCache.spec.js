// @flow

import { expectSaga } from 'redux-saga-test-plan'
import fetchResourceCache, { type FetchMapType } from '../fetchResourceCache'
import DefaultDataContainer from '../../DefaultDataContainer'
import RNFetchBlob from '../../../../__mocks__/rn-fetch-blob'
import CategoriesMapModelBuilder from '../../../../testing/builder/CategoriesMapModelBuilder'
import { transform, forEach } from 'lodash'
import type { FileCacheStateType } from '../../../app/StateType'

jest.mock('../../../fetcher/FetcherModule')
jest.mock('rn-fetch-blob')

const createFetchMap = (resources: { [path: string]: FileCacheStateType }): FetchMapType => {
  return transform(resources, (result, value, path) => {
    forEach(value, (value, url) => {
      result[value.filePath] = [url, path, value.hash]
    })
    return result
  }, {})
}

describe('fetchResourceCache', () => {
  beforeEach(() => {
    RNFetchBlob.fs._reset()
  })

  const city = 'augsburg'
  const language = 'en'

  it('should should fetch resources correctly', async () => {
    const dataContainer = new DefaultDataContainer()

    const categoriesBuilder = new CategoriesMapModelBuilder(1, 2)
    const resources = categoriesBuilder.buildResources()
    const fetchMap = createFetchMap(resources)

    await expectSaga(fetchResourceCache, city, language, fetchMap, dataContainer)
      .not.put.like({ action: { type: 'FETCH_RESOURCES_FAILED' } })
      .run()

    const fetchedResources = await dataContainer.getResourceCache(city, language)
    expect(fetchedResources).toMatchObject(transform(resources, (result, value, path) => {
      forEach(value, (value, url) => {
        delete result[path][url].lastUpdate
      })
      return result
    }, resources))
  })

  it('should should yield error if fetching fails', () => {
    const dataContainer = new DefaultDataContainer()

    const categoriesBuilder = new CategoriesMapModelBuilder(1, 2)
    const resources = categoriesBuilder.buildResources()
    const fetchMap = createFetchMap(resources)

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
