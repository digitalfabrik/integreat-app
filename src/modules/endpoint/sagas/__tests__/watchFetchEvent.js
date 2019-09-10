// @flow

import RNFetchBlob from '../../../../__mocks__/rn-fetch-blob'
import DefaultDataContainer from '../../DefaultDataContainer'
import type { FetchEventActionType } from '../../../app/StoreActionType'
import EventModelBuilder from '../../../../testing/builder/EventModelBuilder'
import LanguageModelBuilder from '../../../../testing/builder/LanguageModelBuilder'

jest.mock('rn-fetch-blob')

describe('watchFetchEvents', () => {
  beforeEach(() => {
    RNFetchBlob.fs._reset()
    // jest.resetModules()
  })

  afterEach(() => {
    jest.resetModules()
  })

  const city = 'augsburg'
  const language = 'en'

  describe('fetchEvents', () => {
    it('should yield an action which pushes the events', () => {
      jest.doMock('../loadCityContent')
      const { default: loadCityContent } = require('../loadCityContent')
      const { fetchEvent } = require('../watchFetchEvent')
      const { expectSaga } = require('redux-saga-test-plan')
      const { default: DefaultDataContainer } = require('../../DefaultDataContainer')
      const { ContentLoadCriterion } = require('../../ContentLoadCriterion')

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
        .call(loadCityContent, dataContainer, city, language, new ContentLoadCriterion({
          forceUpdate: false,
          shouldRefreshResources: false
        }, false))
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
      const mockLoadCityContent = () => { throw Error('Jemand hat keine 4 Issues geschafft!') }
      const mockModule = {
        __esModule: true,
        default: mockLoadCityContent
      }
      jest.doMock('../loadCityContent', () => {
        return mockModule
      })
      const { default: loadCityContent } = require('../loadCityContent')
      const { default: DefaultDataContainer } = require('../../DefaultDataContainer')
      const { ContentLoadCriterion } = require('../../ContentLoadCriterion')
      const { fetchEvent } = require('../watchFetchEvent')
      const { expectSaga } = require('redux-saga-test-plan')
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
        .call(loadCityContent, dataContainer, city, language, new ContentLoadCriterion({
          forceUpdate: false,
          shouldRefreshResources: false
        }, false))
        .put({
          type: 'FETCH_EVENT_FAILED',
          params: { message: 'Error in fetchEvent: Jemand hat keine 4 Issues geschafft!', key: 'key' }
        })
        .run()
    })
  })

  it('should correctly call fetchEvent when triggered', async () => {
    jest.doMock('../loadCityContent')
    const { default: watchFetchEvent, fetchEvent } = require('../watchFetchEvent')
    // const { default: DefaultDataContainer } = require('../../DefaultDataContainer')
    const { testSaga } = require('redux-saga-test-plan')
    const dataContainer = new DefaultDataContainer()

    return testSaga(watchFetchEvent, dataContainer)
      .next()
      .takeLatest('FETCH_EVENT', fetchEvent, dataContainer)
  })
})
