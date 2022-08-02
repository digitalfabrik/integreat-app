import AsyncStorage from '@react-native-async-storage/async-storage'
import { expectSaga, testSaga } from 'redux-saga-test-plan'

import CategoriesMapModelBuilder from 'api-client/src/testing/CategoriesMapModelBuilder'
import EventModelBuilder from 'api-client/src/testing/EventModelBuilder'
import LanguageModelBuilder from 'api-client/src/testing/LanguageModelBuilder'
import PoiModelBuilder from 'api-client/src/testing/PoiModelBuilder'

import BlobUtil from '../../__mocks__/react-native-blob-util'
import { SwitchContentLanguageActionType } from '../../redux/StoreActionType'
import appSettings from '../../utils/AppSettings'
import DefaultDataContainer from '../../utils/DefaultDataContainer'
import { reportError } from '../../utils/sentry'
import loadCityContent from '../loadCityContent'
import watchContentLanguageSwitch, { switchContentLanguage } from '../watchContentLanguageSwitch'

jest.mock('../../utils/sentry')
jest.mock('../../utils/PushNotificationsManager')
jest.mock('../loadCityContent')

describe('watchContentLanguageSwitch', () => {
  beforeEach(async () => {
    BlobUtil.fs._reset()

    await AsyncStorage.clear()
  })
  const city = 'augsburg'
  const newLanguage = 'ar'

  describe('fetchCategory', () => {
    it('should put an action when switching language', async () => {
      const languages = new LanguageModelBuilder(2).build()
      const categoriesBuilder = new CategoriesMapModelBuilder(city, newLanguage)
      const categories = categoriesBuilder.build()
      const eventsBuilder = new EventModelBuilder('fetchCategory-events', 2, city, newLanguage)
      const poisBuilder = new PoiModelBuilder(2)
      const events = eventsBuilder.build()
      const pois = poisBuilder.build()
      const resources = { ...categoriesBuilder.buildResources(), ...eventsBuilder.buildResources() }
      const dataContainer = new DefaultDataContainer()
      await dataContainer.setCategoriesMap(city, newLanguage, categories)
      await dataContainer.setLanguages(city, languages)
      await dataContainer.setResourceCache(city, newLanguage, resources)
      await dataContainer.setEvents(city, newLanguage, events)
      await dataContainer.setPois(city, newLanguage, pois)
      const action: SwitchContentLanguageActionType = {
        type: 'SWITCH_CONTENT_LANGUAGE',
        params: {
          newLanguage,
          city,
        },
      }
      await expectSaga(switchContentLanguage, dataContainer, action)
        .put({
          type: 'MORPH_CONTENT_LANGUAGE',
          params: {
            newCategoriesMap: categories,
            newResourceCache: resources,
            newEvents: events,
            newPois: pois,
            newLanguage,
          },
        })
        .run()
      expect(await appSettings.loadContentLanguage()).toBe(newLanguage)
      expect(reportError).not.toHaveBeenCalled()
    })

    it('should put an error action', async () => {
      const dataContainer = new DefaultDataContainer()
      const action: SwitchContentLanguageActionType = {
        type: 'SWITCH_CONTENT_LANGUAGE',
        params: {
          newLanguage,
          city,
        },
      }
      const error = new Error('Jemand hat keine 4 Issues geschafft!')
      await expectSaga(switchContentLanguage, dataContainer, action)
        .provide({
          call: (effect, next) => {
            if (effect.fn === loadCityContent) {
              throw error
            }

            return next()
          },
        })
        .put({
          type: 'SWITCH_CONTENT_LANGUAGE_FAILED',
          params: {
            message: 'Error in switchContentLanguage: Jemand hat keine 4 Issues geschafft!',
          },
        })
        .run()
      expect(reportError).toHaveBeenCalledTimes(1)
      expect(reportError).toHaveBeenCalledWith(error)
    })
  })

  it('should correctly call switchContentLanguage when triggered', async () => {
    const dataContainer = new DefaultDataContainer()
    return testSaga(watchContentLanguageSwitch, dataContainer)
      .next()
      .takeLatest('SWITCH_CONTENT_LANGUAGE', switchContentLanguage, dataContainer)
  })
})
