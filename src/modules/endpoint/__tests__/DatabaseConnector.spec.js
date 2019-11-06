// @flow

import DatabaseConnector from '../DatabaseConnector'
import DatabaseContext from '../DatabaseContext'
import moment from 'moment-timezone'
import RNFetchBlob from '../../../__mocks__/rn-fetch-blob'
import CityModelBuilder from '../../../testing/builder/CityModelBuilder'
import CategoriesMapModelBuilder from '../../../testing/builder/CategoriesMapModelBuilder'
import LanguageModelBuilder from '../../../testing/builder/LanguageModelBuilder'
import EventModelBuilder from '../../../testing/builder/EventModelBuilder'

jest.mock('rn-fetch-blob')
const databaseConnector = new DatabaseConnector()

afterEach(() => {
  RNFetchBlob.fs._reset()
  jest.clearAllMocks()
})

describe('DatabaseConnector', () => {
  const city = 'augsburg'
  const language = 'de'

  const testCities = new CityModelBuilder(2).build()
  const testCategoriesMap = new CategoriesMapModelBuilder(city, language, 2, 2).build()
  const testLanguages = new LanguageModelBuilder(2).build()
  const testEvents = new EventModelBuilder('testSeed', 2, city, language).build()

  const testResources = {
    'de':
    {
      '/path/to/page':
      {
        'https://test.de/path/to/resource/test.png':
        {
          filePath: '/local/path/to/resource/b4b5dca65e423.png',
          lastUpdate: moment('2011-02-04T00:00:00.000Z'),
          hash: 'testHash'
        }
      },
      '/path/to/page/child':
      {
        'https://test.de/path/to/resource/test2.jpg':
        {
          filePath: '/local/path/to/resource/970c65c41eac0.jpg',
          lastUpdate: moment('2011-05-04T00:00:00.000Z'),
          hash: 'testHash'
        }
      }
    }
  }

  describe('isCitiesPersisted', () => {
    it('should return false if cities are not persisted', async () => {
      const isPersisted = await databaseConnector.isCitiesPersisted()
      expect(isPersisted).toBe(false)
    })
    it('should return true if cities are persisted', async () => {
      await databaseConnector.storeCities([testCities])

      const isPersisted = await databaseConnector.isCitiesPersisted()
      expect(isPersisted).toBe(true)
    })
  })

  describe('storeCities', () => {
    it('should store the json file in the correct path', async () => {
      await databaseConnector.storeCities(testCities)
      expect(RNFetchBlob.fs.writeFile).toBeCalledWith(
        expect.stringContaining('/cities.json'),
        expect.any(String),
        expect.any(String)
      )
    })
  })

  describe('loadCities', () => {
    it('should throw exception if cities are not persisted', () => {
      expect(databaseConnector.loadCities()).rejects.toThrowError()
    })
    it('should return a value that matches the one that was stored', async () => {
      await databaseConnector.storeCities(testCities)

      const cities = await databaseConnector.loadCities()
      expect(cities).toStrictEqual(testCities)
    })
  })

  describe('loadLastUpdate', () => {
    it('should return null if no data is persisted for a given city-language pair', async () => {
      const context = new DatabaseContext('tcc', 'de')
      const moment = await databaseConnector.loadLastUpdate(context)
      expect(moment).toBeNull()
    })
    it('should throw error if currentCity in context is null', () => {
      const context = new DatabaseContext(null, 'de')
      expect(databaseConnector.loadLastUpdate(context)).rejects.toThrowError()
    })
    it('should throw error if currentLanguage is null', () => {
      const context = new DatabaseContext('tcc', null)
      expect(databaseConnector.loadLastUpdate(context)).rejects.toThrowError()
    })
    it('should return a moment that matches the one that was stored', async () => {
      const context = new DatabaseContext('tcc', 'de')

      const dateExpected = moment.tz('20110205', 'UTC')

      await databaseConnector.storeLastUpdate(dateExpected, context)
      const dateReceived = await databaseConnector.loadLastUpdate(context)

      expect(dateExpected.isSame(dateReceived)).toBe(true)
    })
  })

  describe('storeLastUpdate', () => {
    it('should throw error if currentCity in context is null', () => {
      const context = new DatabaseContext(null, 'de')
      const date = moment.tz('20110205', 'UTC')
      expect(databaseConnector.storeLastUpdate(date, context)).rejects.toThrowError()
    })
    it('should throw error if currentLanguage in context is null', () => {
      const context = new DatabaseContext('tcc', null)
      const date = moment.tz('20110205', 'UTC')
      expect(databaseConnector.storeLastUpdate(date, context)).rejects.toThrowError()
    })
    it('should override multiple lastUpdates of the same context', async () => {
      const context = new DatabaseContext('tcc', 'de')
      const date = moment.tz('20110205', 'UTC')
      const date2 = moment.tz('20120205', 'UTC')
      await databaseConnector.storeLastUpdate(date, context)
      await databaseConnector.storeLastUpdate(date2, context)
      const result = await databaseConnector.loadLastUpdate(context)
      expect(date2.isSame(moment(result))).toBe(true)
    })
    it('should store the json file in the correct path', async () => {
      const context = new DatabaseContext('tcc', 'de')
      const date = moment.tz('20110205', 'UTC')
      await databaseConnector.storeLastUpdate(date, context)
      expect(RNFetchBlob.fs.writeFile).toBeCalledWith(
        expect.stringContaining('cities-meta.json'),
        expect.any(String),
        expect.any(String)
      )
    })
  })

  describe('isCategoriesPersisted', () => {
    it('should return false if categories are not persisted', async () => {
      const context = new DatabaseContext('tcc', 'de')
      const isPersisted = await databaseConnector.isCategoriesPersisted(context)
      expect(isPersisted).toBe(false)
    })
    it('should return true if categories are persisted', async () => {
      const context = new DatabaseContext('tcc', 'de')
      await databaseConnector.storeCategories(testCategoriesMap, context)
      const isPersisted = await databaseConnector.isCategoriesPersisted(context)
      expect(isPersisted).toBe(true)
    })
  })

  describe('storeCategories', () => {
    it('should store the json file in the correct path', async () => {
      const context = new DatabaseContext('tcc', 'de')
      await databaseConnector.storeCategories(testCategoriesMap, context)
      expect(RNFetchBlob.fs.writeFile).toBeCalledWith(
        expect.stringContaining('tcc/de/categories.json'),
        expect.any(String),
        expect.any(String)
      )
    })
  })

  describe('loadCategories', () => {
    it('should throw error if categories are not persisted', () => {
      const context = new DatabaseContext('tcc', 'de')
      expect(databaseConnector.loadCategories(context)).rejects.toThrowError()
    })
    it('should return a value that matches the one that was stored', async () => {
      const context = new DatabaseContext('tcc', 'de')
      await databaseConnector.storeCategories(testCategoriesMap, context)

      const categories = await databaseConnector.loadCategories(context)
      expect(categories).toEqual(testCategoriesMap)
    })
  })

  describe('isLanguagesPersisted', () => {
    it('should return false if languages are not persisted', async () => {
      const context = new DatabaseContext('tcc', 'de')
      const isPersisted = await databaseConnector.isLanguagesPersisted(context)
      expect(isPersisted).toBe(false)
    })
    it('should return true if languages are persisted', async () => {
      const context = new DatabaseContext('tcc', 'de')
      await databaseConnector.storeLanguages(testLanguages, context)
      const isPersisted = await databaseConnector.isLanguagesPersisted(context)
      expect(isPersisted).toBe(true)
    })
  })

  describe('storeLanguages', () => {
    it('should store the json file in the correct path', async () => {
      const context = new DatabaseContext('tcc', 'de')
      await databaseConnector.storeLanguages(testLanguages, context)
      expect(RNFetchBlob.fs.writeFile).toBeCalledWith(
        expect.stringContaining('tcc/de/languages.json'),
        expect.any(String),
        expect.any(String)
      )
    })
  })

  describe('loadLanguages', () => {
    it('should throw error if languages are not persisted', () => {
      const context = new DatabaseContext('tcc', 'de')
      expect(databaseConnector.loadLanguages(context)).rejects.toThrowError()
    })
    it('should return a value that matches the one that was stored', async () => {
      const context = new DatabaseContext('tcc', 'de')
      await databaseConnector.storeLanguages(testLanguages, context)

      const languages = await databaseConnector.loadLanguages(context)
      expect(languages).toEqual(testLanguages)
    })
  })

  describe('isEventsPersisted', () => {
    it('should return false if events are not persisted', async () => {
      const context = new DatabaseContext('tcc', 'de')
      const isPersisted = await databaseConnector.isEventsPersisted(context)
      expect(isPersisted).toBe(false)
    })
    it('should return true if events are persisted', async () => {
      const context = new DatabaseContext('tcc', 'de')
      await databaseConnector.storeEvents(testEvents, context)
      const isPersisted = await databaseConnector.isEventsPersisted(context)
      expect(isPersisted).toBe(true)
    })
  })

  describe('storeEvents', () => {
    it('should store the json file in the correct path', async () => {
      const context = new DatabaseContext('tcc', 'de')
      await databaseConnector.storeEvents(testEvents, context)
      expect(RNFetchBlob.fs.writeFile).toBeCalledWith(
        expect.stringContaining('tcc/de/events.json'),
        expect.any(String),
        expect.any(String)
      )
    })
  })

  describe('loadEvents', () => {
    it('should throw error if events are not persisted', () => {
      const context = new DatabaseContext('tcc', 'de')
      expect(databaseConnector.loadEvents(context)).rejects.toThrowError()
    })
    it('should return a value that matches the one that was stored', async () => {
      const context = new DatabaseContext('tcc', 'de')
      await databaseConnector.storeEvents(testEvents, context)

      const events = await databaseConnector.loadEvents(context)
      expect(events).toEqual(testEvents)
    })
  })

  describe('storeResourceCache', () => {
    it('should store the json file in the correct path', async () => {
      const context = new DatabaseContext('tcc', 'de')
      await databaseConnector.storeResourceCache(testResources, context)
      expect(RNFetchBlob.fs.writeFile).toBeCalledWith(
        expect.stringContaining('tcc/files.json'),
        expect.any(String),
        expect.any(String)
      )
    })
  })

  describe('loadResourceCache', () => {
    it('should return an empty value if resources are not persisted', async () => {
      const context = new DatabaseContext('tcc', 'de')

      const cache = await databaseConnector.loadResourceCache(context)
      expect(cache).toEqual({})
    })

    it('should return a value that matches the one that was stored', async () => {
      const context = new DatabaseContext('tcc', 'de')
      await databaseConnector.storeResourceCache(testResources, context)

      const cache = await databaseConnector.loadResourceCache(context)
      expect(cache).toEqual(testResources)
    })
  })
})
