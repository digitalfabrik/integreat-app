// @flow

import DefaultDataContainer from '../DefaultDataContainer'
import DatabaseContext from '../DatabaseContext'
import RNFetchBlob from '../../../__mocks__/rn-fetch-blob'
import moment from 'moment-timezone'
import CityModelBuilder from '../../../testing/builder/CitiyModelBuilder'
import LanguageModelBuilder from '../../../testing/builder/LanguageModelBuilder'
import CategoriesMapModelBuilder from '../../../testing/builder/CategoriesMapModelBuilder'
import EventModelBuilder from '../../../testing/builder/EventModelBuilder'

jest.mock('rn-fetch-blob')

beforeEach(() => {
  RNFetchBlob.fs._reset()
  jest.clearAllMocks()
})

const testResources = {
  '/path/to/page':
    {
      'https://test.de/path/to/resource/test.png':
      {
        filePath: '/local/path/to/resource2/b4b5dca65e423.png',
        lastUpdate: moment('2011-02-04T23:00:00.000Z', moment.ISO_8601),
        hash: 'testHash'
      }
    }
}

const previousResources = {
  '/path/to/page':
      {
        'https://test.de/path/to/resource/test.png':
          {
            filePath: '/local/path/to/resource/b4b5dca65e423.png',
            lastUpdate: moment('2011-02-04T23:00:00.000Z', moment.ISO_8601),
            hash: 'testHash'
          }
      }
}

const anotherTestResources = {
  '/path/to/page':
    {
      'https://test.de/path/to/anotherResource/test.png':
      {
        filePath: '/local/path/to/resource3/b4b5dca65e424.png',
        lastUpdate: moment('2011-02-04T23:00:00.000Z', moment.ISO_8601),
        hash: 'testHash'
      }
    }
}

describe('DefaultDataContainer', () => {
  const cityModelBuilder = new CityModelBuilder(2)
  const testCities = cityModelBuilder.build()

  const languageModelBuilder = new LanguageModelBuilder(2)
  const testLanguages = languageModelBuilder.build()

  const categoriesMapModelBuilder = new CategoriesMapModelBuilder()
  const testCategoryModel = categoriesMapModelBuilder.build()

  const anotherCategoriesMapModelBuilder = new CategoriesMapModelBuilder(1, 1)
  const anotherTestCategoryModel = anotherCategoriesMapModelBuilder.build()

  const eventModelBuilder = new EventModelBuilder('seed', 2)
  const testEvents = eventModelBuilder.build()

  describe('isCached', () => {
    it('should return true if CacheType is stored', async () => {
      const defaultDataContainer = new DefaultDataContainer()
      await defaultDataContainer.setCities(testCities)
      expect(defaultDataContainer.isCached('cities', new DatabaseContext())).toBe(true)
    })
    it('should return false if CacheType is not stored', () => {
      const defaultDataContainer = new DefaultDataContainer()
      expect(defaultDataContainer.isCached('cities', new DatabaseContext())).toBe(false)
    })
  })
  it('should look at the file system if data is not persisted in the cache', async () => {
    const defaultDataContainer = new DefaultDataContainer()
    await defaultDataContainer.setCities(testCities)

    const anotherDataContainer = new DefaultDataContainer()

    await anotherDataContainer.getCities()
    expect(RNFetchBlob.fs.readFile).toHaveBeenCalled()
  })
  it('should return the language associated with the city', async () => {
    const defaultDataContainer = new DefaultDataContainer()
    await defaultDataContainer.setLanguages('testCity', [testLanguages[0]])
    await defaultDataContainer.setLanguages('anotherTestCity', [testLanguages[1]])

    const receivedTestLanguage = await defaultDataContainer.getLanguages('testCity')
    const receivedAnotherTestLanguage = await defaultDataContainer.getLanguages('anotherTestCity')

    expect(receivedTestLanguage).toEqual([testLanguages[0]])
    expect(receivedAnotherTestLanguage).toEqual([testLanguages[1]])
  })
  it('should return the category associated with the context', async () => {
    const defaultDataContainer = new DefaultDataContainer()
    await defaultDataContainer.setCategoriesMap('testCity', 'de', testCategoryModel)
    await defaultDataContainer.setCategoriesMap('anotherTestCity', 'en', anotherTestCategoryModel)

    const receivedTestCategories = await defaultDataContainer.getCategoriesMap('testCity', 'de')
    const receivedAnotherTestCategories = await defaultDataContainer.getCategoriesMap('anotherTestCity', 'en')

    expect(receivedTestCategories).toEqual(testCategoryModel)
    expect(receivedAnotherTestCategories).toEqual(anotherTestCategoryModel)
  })
  it('should return the events associated with the context', async () => {
    const defaultDataContainer = new DefaultDataContainer()
    await defaultDataContainer.setEvents('testCity', 'de', [testEvents[0]])
    await defaultDataContainer.setEvents('anotherTestCity', 'en', [testEvents[1]])

    const receivedTestEvents = await defaultDataContainer.getEvents('testCity', 'de')
    const receivedAnotherTestEvents = await defaultDataContainer.getEvents('anotherTestCity', 'en')

    expect(receivedTestEvents).toEqual([testEvents[0]])
    expect(receivedAnotherTestEvents).toEqual([testEvents[1]])
  })
  it('should return the resources associated with the context', async () => {
    const defaultDataContainer = new DefaultDataContainer()
    await defaultDataContainer.setResourceCache('testCity', 'de', testResources)
    await defaultDataContainer.setResourceCache('anotherTestCity', 'en', anotherTestResources)

    const receivedTestResources = await defaultDataContainer.getResourceCache('testCity', 'de')
    const receivedAnotherTestResources = await defaultDataContainer.getResourceCache('anotherTestCity', 'en')

    expect(receivedTestResources).toEqual({
      '/path/to/page': {
        'https://test.de/path/to/resource/test.png': {
          'filePath': '/local/path/to/resource2/b4b5dca65e423.png',
          'hash': 'testHash',
          'lastUpdate': '2011-02-04T23:00:00.000Z'
        }
      }
    })
    expect(receivedAnotherTestResources).toEqual({
      '/path/to/page': {
        'https://test.de/path/to/anotherResource/test.png': {
          'filePath': '/local/path/to/resource3/b4b5dca65e424.png',
          'hash': 'testHash',
          'lastUpdate': '2011-02-04T23:00:00.000Z'
        }
      }
    })
  })
  it('should return an empty object if no resources where found', async () => {
    const defaultDataContainer = new DefaultDataContainer()
    await defaultDataContainer.setResourceCache('testCity', 'de', testResources)
    const result = await defaultDataContainer.getResourceCache('testCity', 'en')
    expect(result).toBeEmpty()
  })
  it('should return the lastUpdateMoment associated with the context', async () => {
    const defaultDataContainer = new DefaultDataContainer()
    const lastUpdate = moment('20110205')
    const anotherLastUpdate = moment('20110305')

    await defaultDataContainer.setLastUpdate('testCity', 'de', lastUpdate)
    await defaultDataContainer.setLastUpdate('anotherTestCity', 'en', anotherLastUpdate)

    const receivedLastUpdate = await defaultDataContainer.getLastUpdate('testCity', 'de')
    const receivedAnotherLastUpdate = await defaultDataContainer.getLastUpdate('anotherTestCity', 'en')

    expect(lastUpdate.isSame(receivedLastUpdate)).toBe(true)
    expect(anotherLastUpdate.isSame(receivedAnotherLastUpdate)).toBe(true)
  })
  describe('setResourceCache', () => {
    it('should not delete any data if there are no previous resources available', async () => {
      const defaultDataContainer = new DefaultDataContainer()
      await defaultDataContainer.setResourceCache('testCity', 'de', testResources)

      expect(RNFetchBlob.fs.unlink).not.toHaveBeenCalled()
    })
    it('should unlink the outdated resources if there are new resources available', async () => {
      const defaultDataContainer = new DefaultDataContainer()
      await defaultDataContainer.setResourceCache('testCity', 'en', anotherTestResources)
      await defaultDataContainer.setResourceCache('testCity', 'de', previousResources)
      await defaultDataContainer.setResourceCache('testCity', 'de', testResources)

      expect(RNFetchBlob.fs.unlink).toHaveBeenCalledWith('/local/path/to/resource/b4b5dca65e423.png')
    })
  })
  describe('citiesAvailable', () => {
    it('should return true, if cities are cached', async () => {
      const defaultDataContainer = new DefaultDataContainer()
      await defaultDataContainer.setCities(testCities)
      const isAvailable = await defaultDataContainer.citiesAvailable()

      expect(isAvailable).toBe(true)
    })
  })
  describe('categoriesAvailable', () => {
    it('should return true, if categories are cached', async () => {
      const defaultDataContainer = new DefaultDataContainer()
      await defaultDataContainer.setCategoriesMap('testCity', 'de', testCategoryModel)
      const isAvailable = await defaultDataContainer.categoriesAvailable('testCity', 'de')

      expect(isAvailable).toBe(true)
    })
  })
  describe('languagesAvailable', () => {
    it('should return true, if languages are cached', async () => {
      const defaultDataContainer = new DefaultDataContainer()
      await defaultDataContainer.setLanguages('testCity', testLanguages)
      const isAvailable = await defaultDataContainer.languagesAvailable('testCity')

      expect(isAvailable).toBe(true)
    })
  })
  describe('eventsAvailable', () => {
    it('should return true, if events are cached', async () => {
      const defaultDataContainer = new DefaultDataContainer()
      await defaultDataContainer.setEvents('testCity', 'de', testEvents)
      const isAvailable = await defaultDataContainer.eventsAvailable('testCity', 'de')

      expect(isAvailable).toBe(true)
    })
  })
})
