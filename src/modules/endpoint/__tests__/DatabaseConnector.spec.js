// @flow

import DatabaseConnector from '../DatabaseConnector'
import DatabaseContext from '../DatabaseContext'
import moment from 'moment-timezone'
import RNFetchBlob from '../../../__mocks__/rn-fetch-blob'
import CityModelBuilder from '../../../testing/builder/CitiyModelBuilder'
import CategoriesMapModelBuilder from '../../../testing/builder/CategoriesMapModelBuilder'
import LanguageModelBuilder from '../../../testing/builder/LanguageModelBuilder'
import EventModelBuilder from '../../../testing/builder/EventModelBuilder'

jest.mock('rn-fetch-blob')
const databaseConnector = new DatabaseConnector()

beforeEach(() => {
  RNFetchBlob.fs._reset()
})

describe('DatabaseConnector', () => {
  const testCity = new CityModelBuilder(2).build()
  const testCategory = new CategoriesMapModelBuilder(2, 2).build()
  const testLanguage = new LanguageModelBuilder(2).build()
  const testEvent = new EventModelBuilder('testSeed', 2).build()

  const testResources = {
    'de':
    {
      '/path/to/page':
      {
        'https://test.de/path/to/resource/test.png':
        {
          filePath: '/local/path/to/resource/b4b5dca65e423.png',
          lastUpdate: moment('2011-02-04T23:00:00.000Z', moment.ISO_8601),
          hash: 'testHash'
        }
      },
      '/path/to/page/child':
      {
        'https://test.de/path/to/resource/test2.jpg':
        {
          filePath: '/local/path/to/resource/970c65c41eac0.jpg',
          lastUpdate: moment('2011-02-04T23:00:00.000Z', moment.ISO_8601),
          hash: 'testHash'
        }
      }
    }
  }

  describe('getContentPath', () => {
    it('should return path', () => {
      const context = new DatabaseContext('tcc', 'de')
      expect(databaseConnector.getContentPath('key', context)).toMatch('/tcc/de/key.json')
    })
    it('should return path if language is null', () => {
      const context = new DatabaseContext('tcc', null)
      expect(databaseConnector.getContentPath('key', context)).toMatch('/tcc/key.json')
    })
    it('should throw error if context data is null', () => {
      const context = new DatabaseContext(null, null)
      expect(() => databaseConnector.getContentPath('testKey', context)).toThrowError()
    })
    it('should throw error if key is empty', () => {
      const context = new DatabaseContext('tcc', 'de')
      expect(() => databaseConnector.getContentPath('', context)).toThrowError()
    })
  })
  describe('getResourceCachePath', () => {
    it('should return path', () => {
      const context = new DatabaseContext('tcc', 'de')
      expect(databaseConnector.getResourceCachePath(context)).toMatch('/tcc/files.json')
    })
    it('should throw error if cityCode is null', () => {
      const context = new DatabaseContext(null, null)
      expect(() => databaseConnector.getResourceCachePath(context)).toThrowError()
    })
  })
  describe('isCitiesPersisted', () => {
    it('should return false if cities are not persisted', async () => {
      const isPersisted = await databaseConnector.isCitiesPersisted()
      expect(isPersisted).toBe(false)
    })
    it('should return true if cities are persisted', async () => {
      await databaseConnector.storeCities([testCity])

      const isPersisted = await databaseConnector.isCitiesPersisted()
      expect(isPersisted).toBe(true)
    })
  })
  describe('storeCities', () => {
    it('storeCities should throw exception if the data is empty', () => {
      expect(databaseConnector.storeCities([null])).rejects.toThrowError()
    })
  })
  describe('loadCities', () => {
    it('should throw exception if cities are not persisted', () => {
      expect(databaseConnector.loadCities()).rejects.toThrowError()
    })
    it('should return a value that matches the one that was stored', async () => {
      await databaseConnector.storeCities(testCity)

      const cities = await databaseConnector.loadCities()
      expect(cities).toStrictEqual(testCity)
    })
  })
  describe('loadLastUpdate', () => {
    it('should return null if no data is persisted', async () => {
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

      const dateExpected = moment('20110205')

      await databaseConnector.storeLastUpdate(dateExpected, context)
      const dateReceived = await databaseConnector.loadLastUpdate(context)

      expect(dateExpected.isSame(dateReceived)).toBe(true)
    })
  })
  describe('storeLastUpdate', () => {
    it('should throw error if currentCity in context is null', () => {
      const context = new DatabaseContext(null, 'de')
      const date = moment('20110205')
      expect(databaseConnector.storeLastUpdate(date, context)).rejects.toThrowError()
    })
    it('should throw error if currentLanguage in context is null', () => {
      const context = new DatabaseContext('tcc', null)
      const date = moment('20110205')
      expect(databaseConnector.storeLastUpdate(date, context)).rejects.toThrowError()
    })
    it('should override multiple lastUpdates of the same context', async () => {
      const context = new DatabaseContext('tcc', 'de')
      const date = moment('20110205')
      const date2 = moment('20120205')
      await databaseConnector.storeLastUpdate(date, context)
      await databaseConnector.storeLastUpdate(date2, context)
      const result = await databaseConnector.loadLastUpdate(context)
      expect(date2.isSame(moment(result))).toBe(true)
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
      await databaseConnector.storeCategories(testCategory, context)
      const isPersisted = await databaseConnector.isCategoriesPersisted(context)
      expect(isPersisted).toBe(true)
    })
  })

  describe('storeCategories', () => {
    it('should throw error if data is empty', () => {
      const context = new DatabaseContext('tcc', 'de')
      expect(databaseConnector.storeCategories(null, context)).rejects.toThrowError()
    })
  })

  describe('loadCategories', () => {
    it('should throw error if categories are not persisted', () => {
      const context = new DatabaseContext('tcc', 'de')
      expect(databaseConnector.loadCategories(context)).rejects.toThrowError()
    })
    it('should return a value that matches the one that was stored', async () => {
      const context = new DatabaseContext('tcc', 'de')
      await databaseConnector.storeCategories(testCategory, context)

      const categories = await databaseConnector.loadCategories(context)
      expect(categories).toEqual(testCategory)
    })
  })

  describe('isLanguagesPersisted', () => {
    it('should return false if languages are not persisted', async () => {
      const context = new DatabaseContext('tcc', 'de')
      const isPersisted = await databaseConnector.isLanguagesPersisted(context)
      expect(isPersisted).toBe(false)
    })
    it('should return true if categories are persisted', async () => {
      const context = new DatabaseContext('tcc', 'de')
      await databaseConnector.storeLanguages([testLanguage], context)
      const isPersisted = await databaseConnector.isLanguagesPersisted(context)
      expect(isPersisted).toBe(true)
    })
  })

  describe('storeLanguages', () => {
    it('should throw error if data is empty', () => {
      const context = new DatabaseContext('tcc', 'de')
      expect(databaseConnector.storeLanguages([null], context)).rejects.toThrowError()
    })
  })

  describe('loadLanguages', () => {
    it('should throw error if languages are not persisted', () => {
      const context = new DatabaseContext('tcc', 'de')
      expect(databaseConnector.loadLanguages(context)).rejects.toThrowError()
    })
    it('should return a value that matches the one that was stored', async () => {
      const context = new DatabaseContext('tcc', 'de')
      await databaseConnector.storeLanguages(testLanguage, context)

      const languages = await databaseConnector.loadLanguages(context)
      expect(languages).toEqual(testLanguage)
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
      await databaseConnector.storeEvents(testEvent, context)
      const isPersisted = await databaseConnector.isEventsPersisted(context)
      expect(isPersisted).toBe(true)
    })
  })

  describe('storeEvents', () => {
    it('should throw error if data is empty', () => {
      const context = new DatabaseContext('tcc', 'de')
      expect(databaseConnector.storeEvents([null], context)).rejects.toThrowError()
    })
  })

  describe('loadEvents', () => {
    it('should throw error if events are not persisted', () => {
      const context = new DatabaseContext('tcc', 'de')
      expect(databaseConnector.loadEvents(context)).rejects.toThrowError()
    })
    it('should return a value that matches the one that was stored', async () => {
      const context = new DatabaseContext('tcc', 'de')
      await databaseConnector.storeEvents(testEvent, context)

      const events = await databaseConnector.loadEvents(context)
      expect(events).toEqual(testEvent)
    })
  })

  describe('storeResourceCache', () => {
    it('should throw error if data is empty', () => {
      const context = new DatabaseContext('tcc', 'de')
      expect(databaseConnector.storeResourceCache({}, context)).rejects.toThrowError()
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
      // cache is not equal to testResources
      // (lastUpdate is a moment object in the expected data, but a string in the received data)
      // will be fixed in NATIVE-330
      expect(cache).toEqual({
        'de': {
          '/path/to/page': {
            'https://test.de/path/to/resource/test.png': {
              'filePath': '/local/path/to/resource/b4b5dca65e423.png',
              'hash': 'testHash',
              'lastUpdate': '2011-02-04T23:00:00.000Z'
            }
          },
          '/path/to/page/child': {
            'https://test.de/path/to/resource/test2.jpg': {
              'filePath': '/local/path/to/resource/970c65c41eac0.jpg',
              'hash': 'testHash',
              'lastUpdate': '2011-02-04T23:00:00.000Z'
            }
          }
        }
      })
    })
  })
})
