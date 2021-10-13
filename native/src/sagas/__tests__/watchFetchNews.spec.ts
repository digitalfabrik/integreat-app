import { expectSaga, testSaga } from 'redux-saga-test-plan'

import { LOCAL_NEWS_TYPE } from 'api-client/src/routes'
import LanguageModelBuilder from 'api-client/src/testing/LanguageModelBuilder'
import LocalNewsModelBuilder from 'api-client/src/testing/NewsModelBuilder'

import RNFetchBlob from '../../__mocks__/rn-fetch-blob'
import { FetchNewsActionType } from '../../redux/StoreActionType'
import DefaultDataContainer from '../../utils/DefaultDataContainer'
import { reportError } from '../../utils/helpers'
import loadLocalNews from '../loadLocalNews'
import watchFetchNews, { fetchNews } from '../watchFetchNews'

jest.mock('../../utils/helpers', () => ({
  reportError: jest.fn()
}))
jest.mock('../loadCityContent')
jest.mock('../loadLanguages')
jest.mock('../loadLocalNews')

describe('watchFetchNews', () => {
  beforeEach(() => {
    RNFetchBlob.fs._reset()
    jest.clearAllMocks()
  })

  const city = 'altmuehlfranken'
  const language = 'en'

  describe('fetch news', () => {
    const createDataContainer = async (city: string, language: string) => {
      const newsBuilder = new LocalNewsModelBuilder('loadCityContent-news', 2, city, language)
      const news = newsBuilder.build()
      const languages = new LanguageModelBuilder(2).build()
      const dataContainer = new DefaultDataContainer()
      await dataContainer.setLanguages(city, languages)
      return {
        dataContainer,
        news,
        languages
      }
    }

    it('should put an error action if language is not available for specific news', async () => {
      const { dataContainer } = await createDataContainer(city, language)
      const invalidLanguage = '??'
      const action: FetchNewsActionType = {
        type: 'FETCH_NEWS',
        params: {
          city,
          language: invalidLanguage,
          newsId: null,
          type: LOCAL_NEWS_TYPE,
          key: 'route-0',
          criterion: {
            forceUpdate: false,
            shouldRefreshResources: true
          }
        }
      }
      await expectSaga(fetchNews, dataContainer, action)
        .withState({
          cityContent: {
            city
          }
        })
        .put.like({
          action: {
            type: 'FETCH_NEWS_FAILED'
          }
        })
        .run()

      expect(reportError).not.toHaveBeenCalled()
    })

    it('should put an error action', async () => {
      const dataContainer = new DefaultDataContainer()
      const languages = new LanguageModelBuilder(2).build()
      await dataContainer.setLanguages(city, languages)

      const action: FetchNewsActionType = {
        type: 'FETCH_NEWS',
        params: {
          city,
          language,
          newsId: null,
          type: LOCAL_NEWS_TYPE,
          key: 'news-key',
          criterion: {
            forceUpdate: false,
            shouldRefreshResources: true
          }
        }
      }
      const error = new Error('Jemand hat keine 4 Issues geschafft!')
      await expectSaga(fetchNews, dataContainer, action)
        .withState({
          cityContent: {
            city
          }
        })
        .provide({
          call: (effect, next) => {
            if (effect.fn === loadLocalNews) {
              throw error
            }

            return next()
          }
        })
        .put.like({
          action: {
            type: 'FETCH_NEWS_FAILED'
          }
        })
        .run()

      expect(reportError).toHaveBeenCalledTimes(1)
      expect(reportError).toHaveBeenCalledWith(error)
    })
  })

  it('should correctly call fetch news when triggered', async () => {
    const dataContainer = new DefaultDataContainer()
    await testSaga(watchFetchNews, dataContainer).next().takeLatest('FETCH_NEWS', fetchNews, dataContainer)
    expect(reportError).not.toHaveBeenCalled()
  })
})
