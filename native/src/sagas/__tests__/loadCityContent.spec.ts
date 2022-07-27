import AsyncStorage from '@react-native-async-storage/async-storage'
import NetInfo from '@react-native-community/netinfo'
import { mocked } from 'jest-mock'
import moment from 'moment'
import { expectSaga } from 'redux-saga-test-plan'

import { NotFoundError } from 'api-client/src'
import CategoriesMapModelBuilder from 'api-client/src/testing/CategoriesMapModelBuilder'
import CityModelBuilder from 'api-client/src/testing/CityModelBuilder'
import EventModelBuilder from 'api-client/src/testing/EventModelBuilder'
import LanguageModelBuilder from 'api-client/src/testing/LanguageModelBuilder'
import PoiModelBuilder from 'api-client/src/testing/PoiModelBuilder'

import BlobUtil from '../../__mocks__/react-native-blob-util'
import { ContentLoadCriterion } from '../../models/ContentLoadCriterion'
import { createFetchMap } from '../../testing/builder/util'
import mockDate from '../../testing/mockDate'
import appSettings from '../../utils/AppSettings'
import { DataContainer } from '../../utils/DataContainer'
import DatabaseConnector from '../../utils/DatabaseConnector'
import DefaultDataContainer from '../../utils/DefaultDataContainer'
import { reportError } from '../../utils/sentry'
import fetchResourceCache from '../fetchResourceCache'
import loadCategories from '../loadCategories'
import loadCities from '../loadCities'
import loadCityContent from '../loadCityContent'
import loadEvents from '../loadEvents'
import loadLanguages from '../loadLanguages'
import loadPois from '../loadPois'

jest.mock('../../utils/sentry')
jest.mock('@react-native-community/netinfo')
jest.mock('../fetchResourceCache')
jest.mock('../loadCategories')
jest.mock('../loadEvents')
jest.mock('../loadCities')
jest.mock('../loadLanguages')
jest.mock('../loadPois')
jest.mock('../../utils/PushNotificationsManager')

const prepareDataContainer = async (dataContainer: DataContainer, city: string, language: string) => {
  const categoriesBuilder = new CategoriesMapModelBuilder(city, language, 2, 2)
  const eventsBuilder = new EventModelBuilder('loadCityContent-events', 2, city, language)
  const poisBuilder = new PoiModelBuilder(2)
  const categories = categoriesBuilder.build()
  const cities = new CityModelBuilder(1).build()
  const languages = new LanguageModelBuilder(2).build()
  const events = eventsBuilder.build()
  const pois = poisBuilder.build()
  const resources = { ...categoriesBuilder.buildResources(), ...eventsBuilder.buildResources() }
  const fetchMap = createFetchMap(resources)
  await dataContainer.setEvents(city, language, events)
  await dataContainer.setCategoriesMap(city, language, categories)
  await dataContainer.setLanguages(city, languages)
  await dataContainer.setResourceCache(city, language, resources)
  await dataContainer.setCities(cities)
  await dataContainer.setPois(city, language, pois)
  return {
    languages,
    cities,
    categories,
    events,
    pois,
    resources,
    fetchMap,
  }
}

describe('loadCityContent', () => {
  const lastUpdate = moment('2000-01-05T10:10:00.000Z')
  const mockedDate = moment('2000-01-05T11:10:00.000Z')
  let restoreMockedDate: () => void
  beforeEach(async () => {
    BlobUtil.fs._reset()

    await AsyncStorage.clear()
    const { restoreDate } = mockDate(mockedDate)
    restoreMockedDate = restoreDate
  })
  afterEach(async () => {
    restoreMockedDate()
  })
  const city = 'augsburg'
  const language = 'en'

  it('should set selected city when not peeking', async () => {
    const dataContainer = new DefaultDataContainer()
    await prepareDataContainer(dataContainer, city, language)
    await appSettings.setSelectedCity('nuernberg')
    await dataContainer.storeLastUsage(city, false)
    await dataContainer.setLastUpdate(city, language, lastUpdate)
    await expectSaga(
      loadCityContent,
      dataContainer,
      city,
      language,
      new ContentLoadCriterion(
        {
          forceUpdate: false,
          shouldRefreshResources: true,
        },
        false
      )
    ).run()
    expect(await appSettings.loadSelectedCity()).toBe('augsburg')
    expect(await dataContainer.getLastUpdate(city, language)).toBe(lastUpdate)
  })

  it('should not set selected city when peeking', async () => {
    const dataContainer = new DefaultDataContainer()
    await prepareDataContainer(dataContainer, city, language)
    await appSettings.setSelectedCity('nuernberg')
    await dataContainer.storeLastUsage(city, true)
    await dataContainer.setLastUpdate(city, language, lastUpdate)
    await expectSaga(
      loadCityContent,
      dataContainer,
      city,
      language,
      new ContentLoadCriterion(
        {
          forceUpdate: false,
          shouldRefreshResources: true,
        },
        true
      )
    ).run()
    expect(await appSettings.loadSelectedCity()).toBe('nuernberg')
    expect(await dataContainer.getLastUpdate(city, language)).toBe(lastUpdate)
  })

  it('should store last usage', async () => {
    const dataContainer = new DefaultDataContainer()
    await prepareDataContainer(dataContainer, city, language)
    await expectSaga(
      loadCityContent,
      dataContainer,
      city,
      language,
      new ContentLoadCriterion(
        {
          forceUpdate: false,
          shouldRefreshResources: true,
        },
        true
      )
    ).run()
    expect(await new DatabaseConnector().loadLastUsages()).toEqual([
      {
        city: 'augsburg',
        lastUsage: moment('2000-01-05T11:10:00.000Z'),
      },
    ])
  })

  it('should load languages when not peeking', async () => {
    const dataContainer = new DefaultDataContainer()
    const { languages } = await prepareDataContainer(dataContainer, city, language)
    await dataContainer.storeLastUsage(city, false)
    await dataContainer.setLastUpdate(city, language, lastUpdate)
    await expectSaga(
      loadCityContent,
      dataContainer,
      city,
      language,
      new ContentLoadCriterion(
        {
          forceUpdate: false,
          shouldRefreshResources: true,
        },
        false
      )
    )
      .put({
        type: 'PUSH_LANGUAGES',
        params: {
          languages,
        },
      })
      .run()
    expect(await dataContainer.getLastUpdate(city, language)).toBe(lastUpdate)
  })

  it('should not load languages when peeking', async () => {
    const dataContainer = new DefaultDataContainer()
    await prepareDataContainer(dataContainer, city, language)
    await dataContainer.storeLastUsage(city, true)
    await dataContainer.setLastUpdate(city, language, lastUpdate)
    await expectSaga(
      loadCityContent,
      dataContainer,
      city,
      language,
      new ContentLoadCriterion(
        {
          forceUpdate: false,
          shouldRefreshResources: true,
        },
        true
      )
    )
      .not.put.like({
        action: {
          type: 'PUSH_LANGUAGES',
        },
      })
      .run()
    expect(await dataContainer.getLastUpdate(city, language)).toBe(lastUpdate)
  })

  it('should return false if language does not exist', async () => {
    const dataContainer = new DefaultDataContainer()
    await prepareDataContainer(dataContainer, city, language)
    await dataContainer.storeLastUsage(city, false)
    await dataContainer.setLastUpdate(city, language, lastUpdate)
    await expectSaga(
      loadCityContent,
      dataContainer,
      city,
      '??',
      new ContentLoadCriterion(
        {
          forceUpdate: false,
          shouldRefreshResources: true,
        },
        false
      )
    )
      .returns(false)
      .run()
    const lastUpdateAfterLoading = await dataContainer.getLastUpdate(city, language)
    expect(lastUpdateAfterLoading && lastUpdateAfterLoading.isSame(lastUpdate)).toBe(true)
    expect(lastUpdateAfterLoading && lastUpdateAfterLoading.isSame(mockedDate)).toBe(false)
  })

  it('should return true if language does exist', async () => {
    const dataContainer = new DefaultDataContainer()
    await prepareDataContainer(dataContainer, city, language)
    await dataContainer.storeLastUsage(city, false)
    await dataContainer.setLastUpdate(city, language, lastUpdate)
    await expectSaga(
      loadCityContent,
      dataContainer,
      city,
      language,
      new ContentLoadCriterion(
        {
          forceUpdate: false,
          shouldRefreshResources: true,
        },
        false
      )
    )
      .returns(true)
      .run()
    expect(await dataContainer.getLastUpdate(city, language)).toBe(lastUpdate)
  })

  it('should force a content refresh if criterion says so', async () => {
    const dataContainer = new DefaultDataContainer()
    await prepareDataContainer(dataContainer, city, language)
    await dataContainer.storeLastUsage(city, false)
    await dataContainer.setLastUpdate(city, language, lastUpdate)
    await expectSaga(
      loadCityContent,
      dataContainer,
      city,
      language,
      new ContentLoadCriterion(
        {
          forceUpdate: true,
          shouldRefreshResources: true,
        },
        false
      )
    )
      .call(loadLanguages, city, dataContainer, true)
      .call(loadCities, dataContainer, true)
      .call(loadCategories, city, language, dataContainer, true)
      .call(loadEvents, city, language, true, dataContainer, true)
      .call(loadPois, city, language, false, dataContainer, true)
      .run()
  })

  it('should fetch resources when requested and connection type is not cellular', async () => {
    const dataContainer = new DefaultDataContainer()
    const { fetchMap } = await prepareDataContainer(dataContainer, city, language)
    await dataContainer.storeLastUsage(city, false)
    await dataContainer.setLastUpdate(city, language, lastUpdate)
    await expectSaga(
      loadCityContent,
      dataContainer,
      city,
      language,
      new ContentLoadCriterion(
        {
          forceUpdate: false,
          shouldRefreshResources: true,
        },
        false
      )
    )
      .call(fetchResourceCache, city, language, fetchMap, dataContainer)
      .run()
    expect(await dataContainer.getLastUpdate(city, language)).toBe(lastUpdate)
  })

  it('should throw error for nonexisting city', async () => {
    const city = 'abc'
    const dataContainer = new DefaultDataContainer()
    await prepareDataContainer(dataContainer, city, language)
    await dataContainer.storeLastUsage(city, false)
    await dataContainer.setLastUpdate(city, language, lastUpdate)

    await expect(
      expectSaga(
        loadCityContent,
        dataContainer,
        city,
        language,
        new ContentLoadCriterion(
          {
            forceUpdate: false,
            shouldRefreshResources: true,
          },
          false
        )
      )
        .call(loadLanguages, city, dataContainer, true)
        .call(loadCities, dataContainer, true)
        .run()
    ).rejects.toThrow(NotFoundError)
  })

  it('should put languages failed action and report error to sentry', async () => {
    const dataContainer = new DefaultDataContainer()
    await prepareDataContainer(dataContainer, city, language)
    await dataContainer.storeLastUsage(city, false)
    await dataContainer.setLastUpdate(city, language, lastUpdate)

    const error = new Error('Jemand hat keine 4 Issues geschafft!')

    await expectSaga(
      loadCityContent,
      dataContainer,
      city,
      language,
      new ContentLoadCriterion(
        {
          forceUpdate: false,
          shouldRefreshResources: true,
        },
        false
      )
    )
      .provide({
        call: (effect, next) => {
          if (effect.fn === loadLanguages) {
            throw error
          }

          return next()
        },
      })
      .put.like({
        action: {
          type: 'FETCH_LANGUAGES_FAILED',
        },
      })
      .run()

    expect(reportError).toHaveBeenCalledTimes(1)
    expect(reportError).toHaveBeenCalledWith(error)
  })

  it('should not fetch resources when not requested and connection type is not cellular', async () => {
    const dataContainer = new DefaultDataContainer()
    const { fetchMap } = await prepareDataContainer(dataContainer, city, language)
    await dataContainer.storeLastUsage(city, false)
    await dataContainer.setLastUpdate(city, language, lastUpdate)
    await expectSaga(
      loadCityContent,
      dataContainer,
      city,
      language,
      new ContentLoadCriterion(
        {
          forceUpdate: false,
          shouldRefreshResources: false,
        },
        false
      )
    )
      .not.call(fetchResourceCache, city, language, fetchMap, dataContainer)
      .run()
    expect(await dataContainer.getLastUpdate(city, language)).toBe(lastUpdate)
  })

  it('should not fetch resources if connection type is cellular', async () => {
    const previous = mocked(NetInfo.fetch).getMockImplementation() as typeof NetInfo.fetch
    // @ts-expect-error cannot import enum because it is mocked
    mocked(NetInfo.fetch).mockImplementation(async () => ({
      type: 'cellular',
      isConnected: true,
      isInternetReachable: true,
      details: {
        isConnectionExpensive: false,
        cellularGeneration: null,
        carrier: null,
      },
      isWifiEnabled: false,
    }))
    const dataContainer = new DefaultDataContainer()
    const { fetchMap } = await prepareDataContainer(dataContainer, city, language)
    await dataContainer.storeLastUsage(city, false)
    await dataContainer.setLastUpdate(city, language, lastUpdate)
    await expectSaga(
      loadCityContent,
      dataContainer,
      city,
      language,
      new ContentLoadCriterion(
        {
          forceUpdate: false,
          shouldRefreshResources: true,
        },
        false
      )
    )
      .not.call(fetchResourceCache, city, language, fetchMap, dataContainer)
      .run()
    expect(await dataContainer.getLastUpdate(city, language)).toBe(lastUpdate)
    mocked(NetInfo.fetch).mockImplementation(previous)
  })

  it('should update if last update was a long time ago', async () => {
    const dataContainer = new DefaultDataContainer()
    await prepareDataContainer(dataContainer, city, language)
    await dataContainer.storeLastUsage(city, false)
    await dataContainer.setLastUpdate(city, language, moment('1971-01-05T10:10:00.000Z'))
    await expectSaga(
      loadCityContent,
      dataContainer,
      city,
      language,
      new ContentLoadCriterion(
        {
          forceUpdate: false,
          shouldRefreshResources: false,
        },
        false
      )
    ).run()
    const date = await dataContainer.getLastUpdate(city, language)
    expect(date && date.isSame(mockedDate)).toBeTruthy()
  })
})
