import RNFetchBlob from '../../../../__mocks__/rn-fetch-blob'
import DefaultDataContainer from '../../DefaultDataContainer'
import type { FetchNewsActionType } from '../../../app/StoreActionType'
import LocalNewsModelBuilder from 'api-client/src/testing/NewsModelBuilder'
import LanguageModelBuilder from 'api-client/src/testing/LanguageModelBuilder'
import watchFetchNews, { fetchNews } from '../watchFetchNews'
import { expectSaga, testSaga } from 'redux-saga-test-plan'
import loadCityContent from '../loadCityContent'
import { LOCAL_NEWS_TYPE } from 'api-client/src/routes'
jest.mock('rn-fetch-blob')
jest.mock('../loadCityContent')
describe('watchFetchNews', () => {
  beforeEach(() => {
    RNFetchBlob.fs._reset()
  })
  const city = 'altmuehlfranken'
  const language = 'en'
  describe('fetch news', () => {
    const createDataContainer = async (city, language) => {
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
      return expectSaga(fetchNews, dataContainer, action)
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
    })
    it('should put an error action', () => {
      const dataContainer = new DefaultDataContainer()
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
      return expectSaga(fetchNews, dataContainer, action)
        .withState({
          cityContent: {
            city
          }
        })
        .provide({
          call: (effect, next) => {
            if (effect.fn === loadCityContent) {
              throw new Error('Something is wrong!')
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
    })
  })
  it('should correctly call fetch news when triggered', async () => {
    const dataContainer = new DefaultDataContainer()
    return testSaga(watchFetchNews, dataContainer).next().takeLatest('FETCH_NEWS', fetchNews, dataContainer)
  })
})
