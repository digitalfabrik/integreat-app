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
    it('should put an action which pushes the events', async () => {
      const eventsBuilder = new EventModelBuilder('loadCityContent-events', 2, city)
      const events = eventsBuilder.build()
      const resources = eventsBuilder.buildResources()
      const languages = new LanguageModelBuilder(2).build()

      const initialPath = events[0].path

      const dataContainer = new DefaultDataContainer()
      await dataContainer.setEvents(city, language, events)
      await dataContainer.setLanguages(city, languages)
      await dataContainer.setResourceCache(city, language, resources)

      const action: FetchEventActionType = {
        type: 'FETCH_EVENT',
        params: {
          city,
          language,
          path: initialPath,
          key: 'events-key',
          criterion: {
            forceUpdate: false,
            shouldRefreshResources: true
          }
        }
      }
      return expectSaga(fetchEvent, dataContainer, action)
        .put({
          type: 'PUSH_EVENT',
          params: {
            events,
            resourceCache: resources,
            path: initialPath,
            cityLanguages: languages,
            key: 'events-key',
            language,
            city
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
          path: `/${city}/${language}/some-path`,
          key: 'events-key',
          criterion: {
            forceUpdate: false,
            shouldRefreshResources: true
          }
        }
      }

      return expectSaga(fetchEvent, dataContainer, action)
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
