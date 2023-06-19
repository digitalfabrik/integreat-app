import { DateTime } from 'luxon'

import CategoriesMapModelBuilder from 'api-client/src/testing/CategoriesMapModelBuilder'
import CityModelBuilder from 'api-client/src/testing/CityModelBuilder'
import EventModelBuilder from 'api-client/src/testing/EventModelBuilder'
import PoiModelBuilder from 'api-client/src/testing/PoiModelBuilder'

import BlobUtil from '../../__mocks__/react-native-blob-util'
import DatabaseContext from '../../models/DatabaseContext'
import DatabaseConnector from '../DatabaseConnector'
import defaultDataContainer from '../DefaultDataContainer'

const testResources = {
  '/path/to/page': {
    'https://test.de/path/to/resource/test.png': {
      filePath: '/local/path/to/resource2/b4b5dca65e423.png',
      lastUpdate: DateTime.fromISO('2011-02-04T00:00:00.000Z', { zone: 'GMT' }),
      hash: 'testHash',
    },
  },
}
const previousResources = {
  '/path/to/page': {
    'https://test.de/path/to/resource/test.png': {
      filePath: '/local/path/to/resource/b4b5dca65e423.png',
      lastUpdate: DateTime.fromISO('2011-02-04T00:00:00.000Z', { zone: 'GMT' }),
      hash: 'testHash',
    },
  },
}
const anotherTestResources = {
  '/path/to/page': {
    'https://test.de/path/to/anotherResource/test.png': {
      filePath: '/local/path/to/resource3/b4b5dca65e424.png',
      lastUpdate: DateTime.fromISO('2011-02-04T00:00:00.000Z', { zone: 'GMT' }),
      hash: 'testHash',
    },
  },
}

describe('DefaultDataContainer', () => {
  beforeEach(() => {
    BlobUtil.fs._reset()
    jest.clearAllMocks()
    defaultDataContainer.clearInMemoryCache()
  })

  const city = 'augsburg'
  const language = 'de'
  const testPois = new PoiModelBuilder(2).build()
  const testCities = new CityModelBuilder(2).build()
  const testCategoriesMap = new CategoriesMapModelBuilder(city, language).build()
  const anotherTestCategoriesMap = new CategoriesMapModelBuilder(city, language, 1, 1).build()
  const testEvents = new EventModelBuilder('seed', 2, city, language).build()

  describe('isCached', () => {
    it('should return true if CacheType pois is stored', async () => {
      await defaultDataContainer.setPois('testCity', 'de', testPois)
      const context = new DatabaseContext('testCity', 'de')
      expect(defaultDataContainer.isCached('pois', context)).toBe(true)
    })
    it('should return false if CacheType pois is not stored', () => {
      expect(defaultDataContainer.isCached('pois', new DatabaseContext())).toBe(false)
    })
    it('should return true if CacheType is stored', async () => {
      await defaultDataContainer.setCities(testCities)
      expect(defaultDataContainer.isCached('cities', new DatabaseContext())).toBe(true)
    })
    it('should return false if CacheType is not stored', () => {
      expect(defaultDataContainer.isCached('cities', new DatabaseContext())).toBe(false)
    })
  })
  it('should return persisted pois data if not cached', async () => {
    await defaultDataContainer.setPois('testCity', 'de', [testPois[0]!])
    await defaultDataContainer.setPois('anotherTestCity', 'en', [testPois[1]!])
    const receivedTestPois = await defaultDataContainer.getPois('testCity', 'de')
    const receivedAnotherTestPois = await defaultDataContainer.getPois('anotherTestCity', 'en')
    expect(receivedTestPois[0]!.isEqual(testPois[0]!)).toBeDefined()
    expect(receivedAnotherTestPois[0]!.isEqual(testPois[1]!)).toBeDefined()
  })
  it('should return persisted data if not cached', async () => {
    await defaultDataContainer.setCities(testCities)
    defaultDataContainer.clearInMemoryCache()
    const cities = await defaultDataContainer.getCities()
    expect(cities).toEqual(testCities)
  })
  it('should return the category associated with the context', async () => {
    await defaultDataContainer.setCategoriesMap('testCity', 'de', testCategoriesMap)
    await defaultDataContainer.setCategoriesMap('anotherTestCity', 'en', anotherTestCategoriesMap)
    const receivedTestCategories = await defaultDataContainer.getCategoriesMap('testCity', 'de')
    const receivedAnotherTestCategories = await defaultDataContainer.getCategoriesMap('anotherTestCity', 'en')
    expect(receivedTestCategories.isEqual(testCategoriesMap)).toBeDefined()
    expect(receivedAnotherTestCategories.isEqual(anotherTestCategoriesMap)).toBeDefined()
  })
  it('should return the events associated with the context', async () => {
    await defaultDataContainer.setEvents('testCity', 'de', [testEvents[0]!])
    await defaultDataContainer.setEvents('anotherTestCity', 'en', [testEvents[1]!])
    const receivedTestEvents = await defaultDataContainer.getEvents('testCity', 'de')
    const receivedAnotherTestEvents = await defaultDataContainer.getEvents('anotherTestCity', 'en')
    expect(receivedTestEvents[0]!.isEqual(testEvents[0]!)).toBeDefined()
    expect(receivedAnotherTestEvents[0]!.isEqual(testEvents[1]!)).toBeDefined()
  })
  it('should return the pois associated with the context', async () => {
    await defaultDataContainer.setPois('testCity', 'de', [testPois[0]!])
    await defaultDataContainer.setPois('anotherTestCity', 'en', [testPois[1]!])
    const receivedTestPois = await defaultDataContainer.getPois('testCity', 'de')
    const receivedAnotherTestPois = await defaultDataContainer.getPois('anotherTestCity', 'en')
    expect(receivedTestPois[0]!.isEqual(testPois[0]!)).toBeDefined()
    expect(receivedAnotherTestPois[0]!.isEqual(testPois[1]!)).toBeDefined()
  })
  it('should return the resources associated with the context', async () => {
    await defaultDataContainer.setResourceCache('testCity', 'de', testResources)
    await defaultDataContainer.setResourceCache('anotherTestCity', 'en', anotherTestResources)
    const receivedTestResources = await defaultDataContainer.getResourceCache('testCity', 'de')
    const receivedAnotherTestResources = await defaultDataContainer.getResourceCache('anotherTestCity', 'en')
    expect(receivedTestResources).toEqual(testResources)
    expect(receivedAnotherTestResources).toEqual(anotherTestResources)
  })
  it('should return an empty object if no resources were found', async () => {
    await defaultDataContainer.setResourceCache('testCity', 'de', testResources)
    const result = await defaultDataContainer.getResourceCache('testCity', 'en')
    expect(result).toEqual({})
  })
  it('should return the lastUpdateDateTime associated with the context', async () => {
    const databaseConnector = new DatabaseConnector()
    await databaseConnector.storeLastUsage(new DatabaseContext('testCity'))
    await databaseConnector.storeLastUsage(new DatabaseContext('anotherTestCity'))
    const lastUpdate = DateTime.fromISO('2011-02-04T00:00:00.000Z', { zone: 'GMT' })
    const anotherLastUpdate = DateTime.fromISO('2012-02-04T00:00:00.000Z', { zone: 'GMT' })
    await defaultDataContainer.setLastUpdate('testCity', 'de', lastUpdate)
    await defaultDataContainer.setLastUpdate('anotherTestCity', 'en', anotherLastUpdate)
    const receivedLastUpdate = await defaultDataContainer.getLastUpdate('testCity', 'de')
    const receivedAnotherLastUpdate = await defaultDataContainer.getLastUpdate('anotherTestCity', 'en')
    expect(receivedLastUpdate !== null && lastUpdate.hasSame(receivedLastUpdate, 'day')).toBe(true)
    expect(
      receivedAnotherLastUpdate !== null && anotherLastUpdate.hasSame(receivedAnotherLastUpdate, 'millisecond')
    ).toBe(true)
  })
  describe('setResourceCache', () => {
    it('should not delete any data if there are no previous resources available', async () => {
      await defaultDataContainer.setResourceCache('testCity', 'de', testResources)
      expect(BlobUtil.fs.unlink).not.toHaveBeenCalled()
    })
    it('should unlink the outdated resources if there are new resources available', async () => {
      await defaultDataContainer.setResourceCache('testCity', 'de', previousResources)
      // Add mock file, normally this is done in the NativeFetcherModule.fetchAsync
      await BlobUtil.fs.writeFile('/local/path/to/resource/b4b5dca65e423.png', '', 'UTF-8')
      await defaultDataContainer.setResourceCache('testCity', 'de', testResources)
      expect(BlobUtil.fs.unlink).toHaveBeenCalledWith('/local/path/to/resource/b4b5dca65e423.png')
    })
  })
  describe('citiesAvailable', () => {
    it('should return true, if cities are cached', async () => {
      await defaultDataContainer.setCities(testCities)
      const isAvailable = await defaultDataContainer.citiesAvailable()
      expect(isAvailable).toBe(true)
    })
  })
  describe('categoriesAvailable', () => {
    it('should return true, if categories are cached', async () => {
      await defaultDataContainer.setCategoriesMap('testCity', 'de', testCategoriesMap)
      const isAvailable = await defaultDataContainer.categoriesAvailable('testCity', 'de')
      expect(isAvailable).toBe(true)
    })
  })
  describe('eventsAvailable', () => {
    it('should return true, if events are cached', async () => {
      await defaultDataContainer.setEvents('testCity', 'de', testEvents)
      const isAvailable = await defaultDataContainer.eventsAvailable('testCity', 'de')
      expect(isAvailable).toBe(true)
    })
  })
  describe('poisAvailable', () => {
    it('should return true, if pois are cached', async () => {
      await defaultDataContainer.setPois('testCity', 'de', testPois)
      const isAvailable = await defaultDataContainer.poisAvailable('testCity', 'de')
      expect(isAvailable).toBe(true)
    })
  })
})
