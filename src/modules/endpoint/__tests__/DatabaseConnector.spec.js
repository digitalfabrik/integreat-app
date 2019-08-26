// @flow

import { CityModel, CategoryModel, CategoriesMapModel, LanguageModel } from '@integreat-app/integreat-api-client'
import DatabaseConnector from '../DatabaseConnector'
import DatabaseContext from '../DatabaseContext'
import RNFetchBlob from 'rn-fetch-blob'
import moment from 'moment-timezone'

jest.mock('rn-fetch-blob')
const databaseConnector = new DatabaseConnector()

beforeEach(() => {
  RNFetchBlob.fs.reset()
})

describe('DatabaseConnector', () => {
  const testCity = new CityModel({
    name: 'testCityName',
    code: 'tcc',
    live: true,
    eventsEnabled: true,
    extrasEnabled: true,
    sortingName: 'testCity',
    prefix: 'Stadt'
  })
  const testCategory = new CategoryModel({
    root: true,
    path: 'test/path',
    title: 'testCategory',
    content: 'test content',
    thumbnail: 'thumbnail.png',
    parentPath: null,
    order: 1,
    availableLanguages: new Map<string, string>([]),
    lastUpdate: moment('2011-02-04T23:00:00.000Z', moment.ISO_8601),
    hash: 'testHash'
  })
  const testLanguage = new LanguageModel({
    code: 'de',
    name: 'deutsch'
  })
  describe('getContentPath', () => {
    it('should throw error if context data is null', () => {
      const context = new DatabaseContext(null, null)
      expect(() => databaseConnector.getContentPath('testKey', context)).toThrowError()
    })
    it('should throw error if key is empty', () => {
      const context = new DatabaseContext('tcc', 'de')
      expect(() => databaseConnector.getContentPath('', context)).toThrowError()
    })
  })
  describe('isCitiesPersisted', () => {
    it('should return false if cities are not persisted', async () => {
      return databaseConnector.isCitiesPersisted().then(isPersisted => {
        expect(isPersisted).toBe(false)
      })
    })
    it('should return true if cities are persisted', async () => {
      await databaseConnector.storeCities([testCity])

      return databaseConnector.isCitiesPersisted().then(isPersisted => {
        expect(isPersisted).toBe(true)
      })
    })
  })
  describe('storeCities', () => {
    it('storeCities should throw exception if the data is empty', async () => {
      expect(databaseConnector.storeCities([null])).rejects.toThrowError()
    })
  })
  describe('loadCities', () => {
    it('should throw exception if cities are not persisted', async () => {
      expect(databaseConnector.loadCities()).rejects.toThrowError()
    })
    it('should return a value that matches the one that was stored', async () => {
      await databaseConnector.storeCities([testCity])

      return databaseConnector.loadCities().then(cities => {
        expect(cities).toStrictEqual([testCity])
      })
    })
  })
  describe('loadLastUpdate', () => {
    it('should return null if no data is persisted', async () => {
      const context = new DatabaseContext('tcc', 'de')
      return databaseConnector.loadLastUpdate(context).then(moment => {
        expect(moment).toBeNull()
      })
    })
    it('should throw error if currentCity in context is null', async () => {
      const context = new DatabaseContext(null, 'de')
      expect(databaseConnector.loadLastUpdate(context)).rejects.toThrowError()
    })
    it('should throw error if currentLanguage is null', async () => {
      const context = new DatabaseContext('tcc', null)
      expect(databaseConnector.loadLastUpdate(context)).rejects.toThrowError()
    })
    it('should return a moment that matches the one that was stored', async () => {
      const context = new DatabaseContext('tcc', 'de')
      const date = moment('20110205')

      await databaseConnector.storeLastUpdate(date, context)

      return databaseConnector.loadLastUpdate(context).then(moment => {
        expect(date.isSame(moment)).toBe(true)
      })
    })
  })
  describe('storeLastUpdate', () => {
    it('should throw error if currentCity in context is null', async () => {
      const context = new DatabaseContext(null, 'de')
      const date = moment('20110205')
      expect(databaseConnector.storeLastUpdate(date, context)).rejects.toThrowError()
    })
    it('should throw error if currentLanguage in context is null', async () => {
      const context = new DatabaseContext('tcc', null)
      const date = moment('20110205')
      expect(databaseConnector.storeLastUpdate(date, context)).rejects.toThrowError()
    })
  })

  describe('isCategoriesPersisted', () => {
    it('should return false if categories are not persisted', async () => {
      const context = new DatabaseContext('tcc', 'de')
      return databaseConnector.isCategoriesPersisted(context).then(isPersisted => {
        expect(isPersisted).toBe(false)
      })
    })
    it('should return true if categories are persisted', async () => {
      const context = new DatabaseContext('tcc', 'de')
      await databaseConnector.storeCategories(new CategoriesMapModel([testCategory]), context)
      return databaseConnector.isCategoriesPersisted(context).then(isPersisted => {
        expect(isPersisted).toBe(true)
      })
    })
  })

  describe('storeCategories', () => {
    it('should throw error if data is empty', async () => {
      const context = new DatabaseContext('tcc', 'de')
      expect(databaseConnector.storeCategories(null, context)).rejects.toThrowError()
    })
  })

  describe('loadCategories', () => {
    it('should throw error if categories are not persisted', async () => {
      const context = new DatabaseContext('tcc', 'de')
      expect(databaseConnector.loadCategories(context)).rejects.toThrowError()
    })
    it('should return a value that matches the one that was stored', async () => {
      const context = new DatabaseContext('tcc', 'de')
      await databaseConnector.storeCategories(new CategoriesMapModel([testCategory]), context)

      return databaseConnector.loadCategories(context).then(categories => {
        expect(categories.toArray()).toEqual([testCategory])
      })
    })
  })

  describe('isLanguagesPersisted', () => {
    it('should return false if languages are not persisted', async () => {
      const context = new DatabaseContext('tcc', 'de')
      return databaseConnector.isLanguagesPersisted(context).then(isPersisted => {
        expect(isPersisted).toBe(false)
      })
    })
    it('should return true if categories are persisted', async () => {
      const context = new DatabaseContext('tcc', 'de')
      await databaseConnector.storeLanguages([testLanguage], context)
      return databaseConnector.isLanguagesPersisted(context).then(isPersisted => {
        expect(isPersisted).toBe(true)
      })
    })
  })

  describe('storeLanguages', () => {
    it('should throw error if data is empty', async () => {
      const context = new DatabaseContext('tcc', 'de')
      expect(databaseConnector.storeLanguages([null], context)).rejects.toThrowError()
    })
  })

  describe('loadLanguages', () => {
    it('should throw error if languages are not persisted', async () => {
      const context = new DatabaseContext('tcc', 'de')
      expect(databaseConnector.loadLanguages(context)).rejects.toThrowError()
    })
    it('should return a value that matches the one that was stored', async () => {
      const context = new DatabaseContext('tcc', 'de')
      await databaseConnector.storeLanguages([testLanguage], context)

      return databaseConnector.loadLanguages(context).then(languages => {
        expect(languages).toEqual([testLanguage])
      })
    })
  })
})
