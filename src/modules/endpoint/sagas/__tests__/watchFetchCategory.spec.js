// @flow

import RNFetchBlob from '../../../../__mocks__/rn-fetch-blob'
import DefaultDataContainer from '../../DefaultDataContainer'
import type { FetchCategoryActionType } from '../../../app/StoreActionType'
import LanguageModelBuilder from '../../../../testing/builder/LanguageModelBuilder'
import watchFetchCategory, { fetchCategory } from '../watchFetchCategory'
import { expectSaga, testSaga } from 'redux-saga-test-plan'
import loadCityContent from '../loadCityContent'
import { ContentLoadCriterion } from '../../ContentLoadCriterion'
import { call } from 'redux-saga-test-plan/matchers'
import CategoriesMapModelBuilder from '../../../../testing/builder/CategoriesMapModelBuilder'

jest.mock('rn-fetch-blob')
jest.mock('../loadCityContent')

describe('watchFetchCategories', () => {
  beforeEach(() => {
    RNFetchBlob.fs._reset()
  })

  const city = 'augsburg'
  const language = 'en'

  describe('fetchCategory', () => {
    it('should yield an action which pushes the categories', async () => {
      const categoriesBuilder = new CategoriesMapModelBuilder()
      const categories = categoriesBuilder.build()
      const resources = categoriesBuilder.buildResources()
      const languages = new LanguageModelBuilder(2).build()

      const dataContainer = new DefaultDataContainer()
      await dataContainer.setCategoriesMap(city, language, categories)
      await dataContainer.setLanguages(city, languages)
      await dataContainer.setResourceCache(city, language, resources)

      const action: FetchCategoryActionType = {
        type: 'FETCH_CATEGORY',
        params: {
          city,
          language,
          path: '/augsburg/en',
          depth: 2,
          key: 'categories-key',
          criterion: {
            forceUpdate: false,
            shouldRefreshResources: true
          }
        }
      }

      return expectSaga(fetchCategory, dataContainer, action)
        .provide([
          [call.fn(loadCityContent), loadCityContent(dataContainer, city, language, new ContentLoadCriterion({
            forceUpdate: false,
            shouldRefreshResources: true
          }, false))]
        ])
        .put({
          type: 'PUSH_EVENT',
          params: {
            events: categories,
            resourceCache: resources,
            path: '/augsburg/en',
            cityLanguages: languages,
            key: 'categories-key',
            language,
            city
          }
        })
        .run()
    })

    it('should yield an error action', () => {
      const dataContainer = new DefaultDataContainer()

      const action: FetchCategoryActionType = {
        type: 'FETCH_CATEGORY',
        params: {
          city,
          language,
          path: '/augsburg/en',
          depth: 2,
          key: 'categories-key',
          criterion: {
            forceUpdate: false,
            shouldRefreshResources: true
          }
        }
      }

      return expectSaga(fetchCategory, dataContainer, action)
        .provide({
          call: (effect, next) => {
            if (effect.fn === loadCityContent) {
              throw new Error('Jemand hat keine 4 Issues geschafft!')
            }
            return next()
          }
        })
        .put.like({
          action: {
            type: 'FETCH_EVENT_FAILED'
          }
        })
        .run()
    })
  })

  it('should correctly call fetchEvent when triggered', async () => {
    const dataContainer = new DefaultDataContainer()

    return testSaga(watchFetchCategory, dataContainer)
      .next()
      .takeLatest('FETCH_CATEGORY', fetchCategory, dataContainer)
  })
})
