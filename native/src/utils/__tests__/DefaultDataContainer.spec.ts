import { DateTime } from 'luxon'

import CategoriesMapModelBuilder from 'shared/api/endpoints/testing/CategoriesMapModelBuilder'
import EventModelBuilder from 'shared/api/endpoints/testing/EventModelBuilder'
import PoiModelBuilder from 'shared/api/endpoints/testing/PoiModelBuilder'
import RegionModelBuilder from 'shared/api/endpoints/testing/RegionModelBuilder'

import BlobUtil from '../../__mocks__/react-native-blob-util'
import DatabaseContext from '../../models/DatabaseContext'
import DatabaseConnector from '../DatabaseConnector'
import defaultDataContainer from '../DefaultDataContainer'

const testResources = {
  'https://test.de/path/to/resource/test.png': '/local/path/to/resource2/b4b5dca65e423.png',
}
const previousResources = {
  'https://test.de/path/to/resource/test.png': '/local/path/to/resource/b4b5dca65e423.png',
}
const anotherTestResources = {
  'https://test.de/path/to/anotherResource/test.png': '/local/path/to/resource3/b4b5dca65e424.png',
}

describe('DefaultDataContainer', () => {
  beforeEach(() => {
    BlobUtil.fs._reset()
    jest.clearAllMocks()
    defaultDataContainer.clearInMemoryCache()
  })

  const region = 'augsburg'
  const language = 'de'
  const testPois = new PoiModelBuilder(2).build()
  const testRegions = new RegionModelBuilder(2).build()
  const testCategoriesMap = new CategoriesMapModelBuilder(region, language).build()
  const anotherTestCategoriesMap = new CategoriesMapModelBuilder(region, language, 1, 1).build()
  const testEvents = new EventModelBuilder('seed', 2, region, language).build()

  describe('isCached', () => {
    it('should return true if CacheType pois is stored', async () => {
      await defaultDataContainer.setPois('testRegion', 'de', testPois)
      const context = new DatabaseContext('testRegion', 'de')
      expect(defaultDataContainer.isCached('pois', context)).toBe(true)
    })
    it('should return false if CacheType pois is not stored', () => {
      expect(defaultDataContainer.isCached('pois', new DatabaseContext())).toBe(false)
    })
    it('should return true if CacheType is stored', async () => {
      await defaultDataContainer.setRegions(testRegions)
      expect(defaultDataContainer.isCached('regions', new DatabaseContext())).toBe(true)
    })
    it('should return false if CacheType is not stored', () => {
      expect(defaultDataContainer.isCached('regions', new DatabaseContext())).toBe(false)
    })
  })
  it('should return persisted pois data if not cached', async () => {
    await defaultDataContainer.setPois('testRegion', 'de', [testPois[0]!])
    await defaultDataContainer.setPois('anotherTestRegion', 'en', [testPois[1]!])
    const receivedTestPois = await defaultDataContainer.getPois('testRegion', 'de')
    const receivedAnotherTestPois = await defaultDataContainer.getPois('anotherTestRegion', 'en')
    expect(receivedTestPois[0]!.isEqual(testPois[0]!)).toBeTruthy()
    expect(receivedAnotherTestPois[0]!.isEqual(testPois[1]!)).toBeTruthy()
  })
  it('should return persisted data if not cached', async () => {
    await defaultDataContainer.setRegions(testRegions)
    defaultDataContainer.clearInMemoryCache()
    const regions = await defaultDataContainer.getRegions()
    expect(regions).toEqual(testRegions)
  })
  it('should return the category associated with the context', async () => {
    await defaultDataContainer.setCategoriesMap('testRegion', 'de', testCategoriesMap)
    await defaultDataContainer.setCategoriesMap('anotherTestRegion', 'en', anotherTestCategoriesMap)
    const receivedTestCategories = await defaultDataContainer.getCategoriesMap('testRegion', 'de')
    const receivedAnotherTestCategories = await defaultDataContainer.getCategoriesMap('anotherTestRegion', 'en')
    expect(receivedTestCategories.isEqual(testCategoriesMap)).toBeTruthy()
    expect(receivedAnotherTestCategories.isEqual(anotherTestCategoriesMap)).toBeTruthy()
  })
  it('should return the events associated with the context', async () => {
    await defaultDataContainer.setEvents('testRegion', 'de', [testEvents[0]!])
    await defaultDataContainer.setEvents('anotherTestRegion', 'en', [testEvents[1]!])
    const receivedTestEvents = await defaultDataContainer.getEvents('testRegion', 'de')
    const receivedAnotherTestEvents = await defaultDataContainer.getEvents('anotherTestRegion', 'en')
    expect(receivedTestEvents[0]!.isEqual(testEvents[0]!)).toBeTruthy()
    expect(receivedAnotherTestEvents[0]!.isEqual(testEvents[1]!)).toBeTruthy()
  })
  it('should return the pois associated with the context', async () => {
    await defaultDataContainer.setPois('testRegion', 'de', [testPois[0]!])
    await defaultDataContainer.setPois('anotherTestRegion', 'en', [testPois[1]!])
    const receivedTestPois = await defaultDataContainer.getPois('testRegion', 'de')
    const receivedAnotherTestPois = await defaultDataContainer.getPois('anotherTestRegion', 'en')
    expect(receivedTestPois[0]!.isEqual(testPois[0]!)).toBeTruthy()
    expect(receivedAnotherTestPois[0]!.isEqual(testPois[1]!)).toBeTruthy()
  })
  it('should return the resources associated with the context', async () => {
    await defaultDataContainer.setResourceCache('testRegion', 'de', testResources)
    await defaultDataContainer.setResourceCache('anotherTestRegion', 'en', anotherTestResources)
    const receivedTestResources = await defaultDataContainer.getResourceCache('testRegion', 'de')
    const receivedAnotherTestResources = await defaultDataContainer.getResourceCache('anotherTestRegion', 'en')
    expect(receivedTestResources).toEqual(testResources)
    expect(receivedAnotherTestResources).toEqual(anotherTestResources)
  })
  it('should return an empty object if no resources were found', async () => {
    await defaultDataContainer.setResourceCache('testRegion', 'de', testResources)
    const result = await defaultDataContainer.getResourceCache('testRegion', 'en')
    expect(result).toEqual({})
  })
  it('should return the lastUpdateDateTime associated with the context', async () => {
    const databaseConnector = new DatabaseConnector()
    await databaseConnector.storeLastUsage(new DatabaseContext('testRegion'))
    await databaseConnector.storeLastUsage(new DatabaseContext('anotherTestRegion'))
    const lastUpdate = DateTime.fromISO('2011-02-04T00:00:00.000Z')
    const anotherLastUpdate = DateTime.fromISO('2012-02-04T00:00:00.000Z')
    await defaultDataContainer.setLastUpdate('testRegion', 'de', lastUpdate)
    await defaultDataContainer.setLastUpdate('anotherTestRegion', 'en', anotherLastUpdate)
    const receivedLastUpdate = await defaultDataContainer.getLastUpdate('testRegion', 'de')
    const receivedAnotherLastUpdate = await defaultDataContainer.getLastUpdate('anotherTestRegion', 'en')
    expect(receivedLastUpdate !== null && lastUpdate.hasSame(receivedLastUpdate, 'day')).toBe(true)
    expect(
      receivedAnotherLastUpdate !== null && anotherLastUpdate.hasSame(receivedAnotherLastUpdate, 'millisecond'),
    ).toBe(true)
  })
  describe('setResourceCache', () => {
    it('should not delete any data if there are no previous resources available', async () => {
      await defaultDataContainer.setResourceCache('testRegion', 'de', testResources)
      expect(BlobUtil.fs.unlink).not.toHaveBeenCalled()
    })
    it('should unlink the outdated resources if there are new resources available', async () => {
      await defaultDataContainer.setResourceCache('testRegion', 'de', previousResources)
      // Add mock file, normally this is done in the NativeFetcherModule.fetchAsync
      await BlobUtil.fs.writeFile('/local/path/to/resource/b4b5dca65e423.png', '', 'UTF-8')
      await defaultDataContainer.setResourceCache('testRegion', 'de', testResources)
      expect(BlobUtil.fs.unlink).toHaveBeenCalledWith('/local/path/to/resource/b4b5dca65e423.png')
    })
  })
  describe('regionsAvailable', () => {
    it('should return true, if regions are cached', async () => {
      await defaultDataContainer.setRegions(testRegions)
      const isAvailable = await defaultDataContainer.regionsAvailable()
      expect(isAvailable).toBe(true)
    })
  })
  describe('categoriesAvailable', () => {
    it('should return true, if categories are cached', async () => {
      await defaultDataContainer.setCategoriesMap('testRegion', 'de', testCategoriesMap)
      const isAvailable = await defaultDataContainer.categoriesAvailable('testRegion', 'de')
      expect(isAvailable).toBe(true)
    })
  })
  describe('eventsAvailable', () => {
    it('should return true, if events are cached', async () => {
      await defaultDataContainer.setEvents('testRegion', 'de', testEvents)
      const isAvailable = await defaultDataContainer.eventsAvailable('testRegion', 'de')
      expect(isAvailable).toBe(true)
    })
  })
  describe('poisAvailable', () => {
    it('should return true, if pois are cached', async () => {
      await defaultDataContainer.setPois('testRegion', 'de', testPois)
      const isAvailable = await defaultDataContainer.poisAvailable('testRegion', 'de')
      expect(isAvailable).toBe(true)
    })
  })
})
