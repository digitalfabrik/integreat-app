// @flow

import RNFetchBlob from '../../../../__mocks__/rn-fetch-blob'
import DefaultDataContainer from '../../DefaultDataContainer'
import type { FetchEventActionType } from '../../../app/StoreActionType'
import EventModelBuilder from '../../../../testing/builder/EventModelBuilder'
import LanguageModelBuilder from '../../../../testing/builder/LanguageModelBuilder'
import watchFetchEvent, { fetchEvent } from '../watchFetchEvent'
import { expectSaga, testSaga } from 'redux-saga-test-plan'
import loadCityContent from '../loadCityContent'

jest.mock('rn-fetch-blob')
jest.mock('../loadCityContent')

describe('watchFetchEvents', () => {
  beforeEach(() => {
    RNFetchBlob.fs._reset()
  })

  const city = 'augsburg'
  const language = 'en'

  describe('fetchEvents', () => {
    const createDataContainer = async (city, language) => {
      const eventsBuilder = new EventModelBuilder('loadCityContent-events', 2)
      const events = eventsBuilder.build()
      const resources = eventsBuilder.buildResources()
      const languages = new LanguageModelBuilder(2).build()

      const dataContainer = new DefaultDataContainer()
      await dataContainer.setEvents(city, language, events)
      await dataContainer.setLanguages(city, languages)
      await dataContainer.setResourceCache(city, language, resources)
      return { dataContainer, events, resources, languages }
    }

    it('should put an action which pushes the events', async () => {
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
            shouldRefreshResources: true
          }
        }
      }
      return expectSaga(fetchEvent, dataContainer, action)
        .withState({ cityContent: { city } })
        .put({
          type: 'PUSH_EVENT',
          params: {
            events,
            resourceCache: resources,
            path: events[0].path,
            cityLanguages: languages,
            key: 'events-key',
            language,
            city
          }
        })
        .run()
    })

    it('should put pushEventLanguages action if content can not be retrieved for events list', async () => {
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
        .withState({ cityContent: { city: city } })
        .put({
          type: 'PUSH_EVENT_LANGUAGES',
          params: {
            city: 'augsburg',
            language: '??',
            allAvailableLanguages: new Map(languages.map(lng => ([lng.code, null]))),
            key: 'route-0'
          }
        })
        .run()
    })

    it('should put an error action if content can not be retrieved for specific event', async () => {
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
        .withState({ cityContent: { city } })
        .put.like({ action: { type: 'FETCH_EVENT_FAILED' } })
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
        .withState({ cityContent: { city } })
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

    return testSaga(watchFetchEvent, dataContainer)
      .next()
      .takeLatest('FETCH_EVENT', fetchEvent, dataContainer)
  })
})
