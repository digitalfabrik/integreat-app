// @flow

import RNFetchBlob from '../../../../__mocks__/rn-fetch-blob'
import DefaultDataContainer from '../../DefaultDataContainer'
import type { FetchCategoryActionType } from '../../../app/StoreActionType'
import LanguageModelBuilder from '../../../../testing/builder/LanguageModelBuilder'
import watchFetchCategory, { fetchCategory } from '../watchFetchCategory'
import { expectSaga, testSaga } from 'redux-saga-test-plan'
import loadCityContent from '../loadCityContent'
import CategoriesMapModelBuilder from '../../../../testing/builder/CategoriesMapModelBuilder'

jest.mock('rn-fetch-blob')
jest.mock('../loadCityContent')

const createDataContainer = async (city: string, language: string) => {
  const categoriesBuilder = new CategoriesMapModelBuilder()
  const categories = categoriesBuilder.build()
  const resources = categoriesBuilder.buildResources()
  const languages = new LanguageModelBuilder(2).build()

  const initialPath = categories.toArray()[0]

  const dataContainer = new DefaultDataContainer()
  await dataContainer.setCategoriesMap(city, language, categories)
  await dataContainer.setLanguages(city, languages)
  await dataContainer.setResourceCache(city, language, resources)

  return { categories, resources, languages, dataContainer, initialPath }
}

describe('watchFetchCategories', () => {
  beforeEach(() => {
    RNFetchBlob.fs._reset()
  })

  const city = 'augsburg'
  const language = 'en'

  describe('fetchCategory', () => {
    it('should put an action which pushes the categories', async () => {
      const { categories, resources, languages, dataContainer, initialPath } = await createDataContainer(city, language)

      const action: FetchCategoryActionType = {
        type: 'FETCH_CATEGORY',
        params: {
          city,
          language,
          path: initialPath,
          depth: 2,
          key: 'categories-key',
          criterion: {
            forceUpdate: false,
            shouldRefreshResources: true
          }
        }
      }

      return expectSaga(fetchCategory, dataContainer, action)
        .withState({
          cityContent: {
            city: city
          }
        })
        .put({
          type: 'PUSH_CATEGORY',
          params: {
            categoriesMap: categories,
            resourceCache: resources,
            path: initialPath,
            cityLanguages: languages,
            depth: 2,
            key: 'categories-key',
            language,
            city
          }
        })
        .run()
    })

    it('should put an action which pushes the categories when peeking', async () => {
      const { categories, resources, dataContainer, initialPath } = await createDataContainer(city, language)
      const anotherCity = 'anotherCity'

      const action: FetchCategoryActionType = {
        type: 'FETCH_CATEGORY',
        params: {
          city,
          language,
          path: initialPath,
          depth: 2,
          key: 'categories-key',
          criterion: {
            forceUpdate: false,
            shouldRefreshResources: true
          }
        }
      }

      return expectSaga(fetchCategory, dataContainer, action)
        .withState({
          cityContent: {
            city: anotherCity
          }
        })
        .put({
          type: 'PUSH_CATEGORY',
          params: {
            categoriesMap: categories,
            resourceCache: resources,
            path: initialPath,
            cityLanguages: [],
            depth: 2,
            key: 'categories-key',
            language,
            city
          }
        })
        .run()
    })

    it('should do nothing if content can not be retrieved (e.g. language invalid) and not peeking', async () => {
      const { dataContainer, initialPath } = await createDataContainer(city, language)

      const invalidLanguage = '??'
      const action: FetchCategoryActionType = {
        type: 'FETCH_CATEGORY',
        params: {
          city,
          language: invalidLanguage,
          path: initialPath,
          depth: 2,
          key: 'categories-key',
          criterion: {
            forceUpdate: false,
            shouldRefreshResources: true
          }
        }
      }

      return expectSaga(fetchCategory, dataContainer, action)
        .withState({
          cityContent: {
            city: city
          }
        })
        .not.put.like({ action: { type: 'PUSH_CATEGORY' } })
        .not.put.like({ action: { type: 'FETCH_CATEGORY_FAILED' } })
        .run()
    })

    it('should try to loadCityContent with an invalid language when peeking', async () => {
      const { dataContainer, initialPath } = await createDataContainer(city, language)

      const anotherCity = 'anotherCity'
      const invalidLanguage = '??'
      const action: FetchCategoryActionType = {
        type: 'FETCH_CATEGORY',
        params: {
          city,
          language: invalidLanguage,
          path: initialPath,
          depth: 2,
          key: 'categories-key',
          criterion: {
            forceUpdate: false,
            shouldRefreshResources: true
          }
        }
      }

      return expectSaga(fetchCategory, dataContainer, action)
        .withState({
          cityContent: {
            city: anotherCity
          }
        })
        .provide({
          call: (effect, next) => {
            if (effect.fn === loadCityContent) {
              if (!effect.args.includes(invalidLanguage)) {
                throw new Error(`${invalidLanguage} wasn't fetched`)
              }

              throw new Error(`Failed to fetch the language ${invalidLanguage}!`)
            }
            return next()
          }
        })
        .put({
          type: 'FETCH_CATEGORY_FAILED',
          params: {
            message: 'Error in fetchCategory: Failed to fetch the language ??!',
            key: 'categories-key'
          }
        })
        .run()
    })

    it('should put an error action', () => {
      const dataContainer = new DefaultDataContainer()

      const action: FetchCategoryActionType = {
        type: 'FETCH_CATEGORY',
        params: {
          city,
          language,
          path: `/${city}/${language}/some-path`,
          depth: 2,
          key: 'categories-key',
          criterion: {
            forceUpdate: false,
            shouldRefreshResources: true
          }
        }
      }

      return expectSaga(fetchCategory, dataContainer, action)
        .withState({
          cityContent: {
            city
          }
        })
        .provide({
          call: (effect, next) => {
            if (effect.fn === loadCityContent) {
              throw new Error('Jemand hat keine 4 Issues geschafft!')
            }
            return next()
          }
        })
        .put({
          type: 'FETCH_CATEGORY_FAILED',
          params: {
            message: 'Error in fetchCategory: Jemand hat keine 4 Issues geschafft!',
            key: 'categories-key'
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
