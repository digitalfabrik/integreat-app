// @flow

import RNFetchBlob from '../../../../__mocks__/rn-fetch-blob'
import DefaultDataContainer from '../../DefaultDataContainer'
import type { FetchEventActionType } from '../../../app/StoreActionType'
import EventModelBuilder from '../../../../testing/builder/EventModelBuilder'
import LanguageModelBuilder from '../../../../testing/builder/LanguageModelBuilder'
import watchFetchEvent, { fetchEvent } from '../watchFetchEvent'
import { expectSaga, testSaga } from 'redux-saga-test-plan'
import loadCityContent from '../loadCityContent'
import { ContentLoadCriterion } from '../../ContentLoadCriterion'
import { call } from 'redux-saga-test-plan/matchers'

jest.mock('rn-fetch-blob')
jest.mock('../loadCityContent')

describe('watchFetchEvents', () => {
  beforeEach(() => {
    RNFetchBlob.fs._reset()
  })

  const city = 'augsburg'
  const language = 'en'

  describe('fetchEvents', () => {
    it('should yield an action which pushes the events', () => {
      const events = new EventModelBuilder('loadCityContent-events', 2).build()
      const languages = new LanguageModelBuilder(2).build()

      const dataContainer = new DefaultDataContainer()

      const action: FetchEventActionType = {
        type: 'FETCH_EVENT',
        params: {
          city,
          language,
          path: '/',
          key: 'key',
          criterion: {
            forceUpdate: false,
            shouldRefreshResources: false
          }
        }
      }

      return expectSaga(fetchEvent, dataContainer, action)
        .provide([
          [call.fn(loadCityContent), loadCityContent(dataContainer, city, language, new ContentLoadCriterion({
            forceUpdate: false,
            shouldRefreshResources: false
          }, false))]
        ])
        .put({
          type: 'PUSH_EVENT',
          params: {
            events,
            resourceCache: {}, // fixme create proper data
            path: '/',
            cityLanguages: languages,
            key: 'key',
            language,
            city
          }
        })
        .run()
    })

    it('should yield an error action', () => {
      const dataContainer = new DefaultDataContainer()

      const action: FetchEventActionType = {
        type: 'FETCH_EVENT',
        params: {
          city,
          language,
          path: '/',
          key: 'key',
          criterion: {
            forceUpdate: false,
            shouldRefreshResources: false
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
