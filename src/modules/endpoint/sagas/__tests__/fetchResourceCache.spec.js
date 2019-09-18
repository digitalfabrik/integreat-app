// @flow

import { expectSaga } from 'redux-saga-test-plan'
import fetchResourceCache from '../fetchResourceCache'
import DefaultDataContainer from '../../DefaultDataContainer'
import RNFetchBlob from '../../../../__mocks__/rn-fetch-blob'
import CategoriesMapModelBuilder from '../../../../testing/builder/CategoriesMapModelBuilder'
import { transform, forEach } from 'lodash'
import Moment from 'moment'

jest.mock('../../../fetcher/FetcherModule')
jest.mock('rn-fetch-blob')

describe('fetchResourceCache', () => {
  beforeEach(() => {
    RNFetchBlob.fs._reset()
  })

  const city = 'augsburg'
  const language = 'en'

  it('should should fetch and create error message', async () => {
    const spy = jest.spyOn(console, 'warn')

    const dataContainer = new DefaultDataContainer()

    const categoriesBuilder = new CategoriesMapModelBuilder(1, 2)
    const resources = categoriesBuilder.buildResources()
    const fetchMap = categoriesBuilder.buildFetchMap()

    await expectSaga(fetchResourceCache, city, language, fetchMap, dataContainer)
      .not.put.like({ action: { type: 'FETCH_RESOURCES_FAILED' } })
      .run()

    const fetchedResources = await dataContainer.getResourceCache(city, language)

    const lessStrictExpected = transform(resources, (result, value, path) => {
      forEach(value, (value, url) => {
        result[path][url].lastUpdate = expect.any(Moment)
      })
      return result
    }, resources)

    delete lessStrictExpected['/augsburg/de/category_0-0'] /* The first category is excluded because an the
                                                              FetcherModule produced an error for this */
    expect(fetchedResources).toMatchObject(lessStrictExpected)
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('Failed to download https://integreat/title_0-0-300x300.png'))
    spy.mockRestore()
  })

  it('should should yield error if fetching fails', () => {
    const dataContainer = new DefaultDataContainer()

    const categoriesBuilder = new CategoriesMapModelBuilder(1, 2)
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
