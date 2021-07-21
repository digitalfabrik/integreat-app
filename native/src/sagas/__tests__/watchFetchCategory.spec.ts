import RNFetchBlob from '../../__mocks__/rn-fetch-blob'
import DefaultDataContainer from '../../utils/DefaultDataContainer'
import { FetchCategoryActionType } from '../../redux/StoreActionType'
import LanguageModelBuilder from 'api-client/src/testing/LanguageModelBuilder'
import watchFetchCategory, { fetchCategory } from '../watchFetchCategory'
import { expectSaga, testSaga } from 'redux-saga-test-plan'
import loadCityContent from '../loadCityContent'
import CategoriesMapModelBuilder from 'api-client/src/testing/CategoriesMapModelBuilder'
import moment from 'moment'
import mockDate from '../../testing/mockDate'
import { ErrorCode } from 'api-client'

jest.mock('../loadCityContent')

const languages = new LanguageModelBuilder(2).build()
const createDataContainer = async (city: string, language: string) => {
  const categoriesBuilder = new CategoriesMapModelBuilder(city, language)
  const categories = categoriesBuilder.build()
  const resources = categoriesBuilder.buildResources()
  const dataContainer = new DefaultDataContainer()
  await dataContainer.setCategoriesMap(city, language, categories)
  await dataContainer.setLanguages(city, languages)
  await dataContainer.setResourceCache(city, language, resources)
  await dataContainer.storeLastUsage(city, false)
  await dataContainer.setLastUpdate(city, language, moment('2020-01-01T01:00:00.000Z'))
  return {
    categories,
    resources,
    languages,
    dataContainer,
    initialPath: `/${city}/${language}`
  }
}

describe('watchFetchCategories', () => {
  const mockedDate = moment('2020-01-01T12:00:00.000Z')
  let restoreMockedDate

  beforeEach(() => {
    RNFetchBlob.fs._reset()

    const { restoreDate } = mockDate(mockedDate)
    restoreMockedDate = restoreDate
  })

  afterEach(async () => {
    restoreMockedDate()
  })

  const city = 'augsburg'
  const language = 'en'

  describe('fetchCategory', () => {
    it('should put an action which refreshes the categories if the content should be refreshed', async () => {
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
            forceUpdate: true,
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
            city,
            refresh: true
          }
        })
        .run()
    })

    it('should put an action which pushes the categories if content should not be refreshed', async () => {
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
            shouldRefreshResources: false
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
            city,
            refresh: false
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
            shouldRefreshResources: false
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
            city,
            refresh: false
          }
        })
        .run()
    })

    it('should put an action which refreshes the categories when peeking if the content should be refreshed', async () => {
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
            forceUpdate: true,
            shouldRefreshResources: false
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
            city,
            refresh: true
          }
        })
        .run()
    })

    it('should put error action if language is not available for root model', async () => {
      const { dataContainer, languages } = await createDataContainer(city, language)
      const invalidLanguage = '??'
      const action: FetchCategoryActionType = {
        type: 'FETCH_CATEGORY',
        params: {
          city,
          language: invalidLanguage,
          path: '/augsburg/??',
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
        .put.like({
          action: {
            type: 'FETCH_CATEGORY_FAILED',
            params: {
              city: 'augsburg',
              language: '??',
              depth: 2,
              path: '/augsburg/??',
              allAvailableLanguages: new Map(languages.map(lng => [lng.code, `/${city}/${lng.code}`])),
              key: 'categories-key'
            }
          }
        })
        .run()
    })

    it('should put failed action if language is not available and not peeking', async () => {
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
        .put.like({
          action: {
            type: 'FETCH_CATEGORY_FAILED'
          }
        })
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
            code: ErrorCode.UnknownError,
            key: 'categories-key',
            path: initialPath,
            depth: 2,
            language: '??',
            allAvailableLanguages: null,
            city
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
            code: ErrorCode.UnknownError,
            key: 'categories-key',
            path: `/${city}/${language}/some-path`,
            allAvailableLanguages: null,
            depth: 2,
            language: 'en',
            city: 'augsburg'
          }
        })
        .run()
    })
  })

  it('should correctly call fetchCategory when triggered', async () => {
    const dataContainer = new DefaultDataContainer()
    return testSaga(watchFetchCategory, dataContainer).next().takeEvery('FETCH_CATEGORY', fetchCategory, dataContainer)
  })
})
