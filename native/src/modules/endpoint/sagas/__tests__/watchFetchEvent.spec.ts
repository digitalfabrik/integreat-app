import RNFetchBlob from '../../../../__mocks__/rn-fetch-blob'
import DefaultDataContainer from '../../DefaultDataContainer'
import type { FetchEventActionType } from '../../../app/StoreActionType'
import EventModelBuilder from 'api-client/src/testing/EventModelBuilder'
import LanguageModelBuilder from 'api-client/src/testing/LanguageModelBuilder'
import watchFetchEvent, { fetchEvent } from '../watchFetchEvent'
import { expectSaga, testSaga } from 'redux-saga-test-plan'
import loadCityContent from '../loadCityContent'
import ErrorCodes from '../../../error/ErrorCodes'
import moment from 'moment'
import mockDate from '../../../../testing/mockDate'
jest.mock('rn-fetch-blob')
jest.mock('../loadCityContent')
describe('watchFetchEvents', () => {
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
  describe('fetchEvents', () => {
    const createDataContainer = async (city, language) => {
      const eventsBuilder = new EventModelBuilder('loadCityContent-events', 2, city, language)
      const events = eventsBuilder.build()
      const resources = eventsBuilder.buildResources()
      const languages = new LanguageModelBuilder(2).build()
      const dataContainer = new DefaultDataContainer()
      await dataContainer.setEvents(city, language, events)
      await dataContainer.setLanguages(city, languages)
      await dataContainer.setResourceCache(city, language, resources)
      await dataContainer.storeLastUsage(city, false)
      await dataContainer.setLastUpdate(city, language, moment('2020-01-01T01:00:00.000Z'))
      return {
        dataContainer,
        events,
        resources,
        languages
      }
    }

    it('should put an action which refreshes the events if the events should be refreshed', async () => {
      const { events, dataContainer, resources, languages } = await createDataContainer(city, language)
      const action: FetchEventActionType = {
        type: 'FETCH_EVENT',
        params: {
          city,
          language,
          path: events[0].path,
          key: 'events-key',
          criterion: {
            forceUpdate: true,
            shouldRefreshResources: true
          }
        }
      }
      return expectSaga(fetchEvent, dataContainer, action)
        .withState({
          cityContent: {
            city
          }
        })
        .put({
          type: 'PUSH_EVENT',
          params: {
            events,
            resourceCache: resources,
            path: events[0].path,
            cityLanguages: languages,
            key: 'events-key',
            language,
            city,
            refresh: true
          }
        })
        .run()
    })
    it('should put an action which pushes the events if the events should not be refreshed', async () => {
      const { events, dataContainer, resources, languages } = await createDataContainer(city, language)
      const action: FetchEventActionType = {
        type: 'FETCH_EVENT',
        params: {
          city,
          language,
          path: events[0].path,
          key: 'events-key',
          criterion: {
            forceUpdate: false,
            shouldRefreshResources: false
          }
        }
      }
      return expectSaga(fetchEvent, dataContainer, action)
        .withState({
          cityContent: {
            city
          }
        })
        .put({
          type: 'PUSH_EVENT',
          params: {
            events,
            resourceCache: resources,
            path: events[0].path,
            cityLanguages: languages,
            key: 'events-key',
            language,
            city,
            refresh: false
          }
        })
        .run()
    })
    it('should put error action if language is not available for events list', async () => {
      const { dataContainer, languages } = await createDataContainer(city, language)
      const invalidLanguage = '??'
      const action: FetchEventActionType = {
        type: 'FETCH_EVENT',
        params: {
          city,
          language: invalidLanguage,
          path: null,
          key: 'route-0',
          criterion: {
            forceUpdate: false,
            shouldRefreshResources: true
          }
        }
      }
      return expectSaga(fetchEvent, dataContainer, action)
        .withState({
          cityContent: {
            city: city
          }
        })
        .put({
          type: 'FETCH_EVENT_FAILED',
          params: {
            city: 'augsburg',
            language: '??',
            message: 'Could not load event.',
            code: ErrorCodes.PageNotFound,
            path: null,
            allAvailableLanguages: new Map(languages.map(lng => [lng.code, null])),
            key: 'route-0'
          }
        })
        .run()
    })
    it('should put an error action if language is not available for specific event', async () => {
      const { dataContainer } = await createDataContainer(city, language)
      const invalidLanguage = '??'
      const action: FetchEventActionType = {
        type: 'FETCH_EVENT',
        params: {
          city,
          language: invalidLanguage,
          path: `/${city}/${invalidLanguage}/events/some_event`,
          key: 'route-0',
          criterion: {
            forceUpdate: false,
            shouldRefreshResources: true
          }
        }
      }
      return expectSaga(fetchEvent, dataContainer, action)
        .withState({
          cityContent: {
            city
          }
        })
        .put.like({
          action: {
            type: 'FETCH_EVENT_FAILED'
          }
        })
        .run()
    })
    it('should put an error action', () => {
      const dataContainer = new DefaultDataContainer()
      const action: FetchEventActionType = {
        type: 'FETCH_EVENT',
        params: {
          city,
          language,
          path: `/${city}/${language}/events/some-event`,
          key: 'events-key',
          criterion: {
            forceUpdate: false,
            shouldRefreshResources: true
          }
        }
      }
      return expectSaga(fetchEvent, dataContainer, action)
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
    return testSaga(watchFetchEvent, dataContainer).next().takeEvery('FETCH_EVENT', fetchEvent, dataContainer)
  })
})
