import DatabaseConnector from '../DatabaseConnector'
import DatabaseContext from '../DatabaseContext'
import moment from 'moment'
import RNFetchBlob from '../../../__mocks__/rn-fetch-blob'
import CityModelBuilder from 'api-client/src/testing/CityModelBuilder'
import CategoriesMapModelBuilder from 'api-client/src/testing/CategoriesMapModelBuilder'
import LanguageModelBuilder from 'api-client/src/testing/LanguageModelBuilder'
import EventModelBuilder from 'api-client/src/testing/EventModelBuilder'
import mockDate from '../../../testing/mockDate'

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
    de: {
      '/path/to/page': {
        'https://test.de/path/to/resource/test.png': {
          filePath: '/local/path/to/resource/b4b5dca65e423.png',
          lastUpdate: moment('2011-02-04T00:00:00.000Z'),
          hash: 'testHash'
        }
      },
      '/path/to/page/child': {
        'https://test.de/path/to/resource/test2.jpg': {
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
      await databaseConnector.storeCities(testCities)
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
    it('should throw exception if cities are not persisted', async () => {
      await expect(databaseConnector.loadCities()).rejects.toThrowError()
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
    it('should return null if persisted data is malformatted for a given city-language pair', async () => {
      const context = new DatabaseContext('tcc', 'de')
      RNFetchBlob.fs.writeFile(databaseConnector.getMetaCitiesPath(), '{ "i": "am": "malformatted" } }', 'utf8')
      const moment = await databaseConnector.loadLastUpdate(context)
      expect(moment).toBeNull()
    })
    it('should throw error if currentCity in context is null', async () => {
      const context = new DatabaseContext(null, 'de')
      await expect(databaseConnector.loadLastUpdate(context)).rejects.toThrowError()
    })
    it('should throw error if currentLanguage is null', async () => {
      const context = new DatabaseContext('tcc', null)
      await expect(databaseConnector.loadLastUpdate(context)).rejects.toThrowError()
    })
    it('should return a moment that matches the one that was stored', async () => {
      const context = new DatabaseContext('tcc', 'de')
      const dateExpected = moment('2011-05-04T00:00:00.000Z')
      await databaseConnector.storeLastUsage(context, false)
      await databaseConnector.storeLastUpdate(dateExpected, context)
      expect(dateExpected).toStrictEqual(await databaseConnector.loadLastUpdate(context))
    })
  })
  describe('storeLastUpdate', () => {
    it('should throw error if currentCity in context is null', async () => {
      const context = new DatabaseContext(null, 'de')
      const date = moment('2011-05-04T00:00:00.000Z')
      await expect(databaseConnector.storeLastUpdate(date, context)).rejects.toThrowError()
    })
    it('should throw error if currentLanguage in context is null', async () => {
      const context = new DatabaseContext('tcc', null)
      const date = moment('2011-05-04T00:00:00.000Z')
      await expect(databaseConnector.storeLastUpdate(date, context)).rejects.toThrowError()
    })
    it('should throw error if meta of city is null', async () => {
      const context = new DatabaseContext('tcc', null)
      const date = moment('2011-05-04T00:00:00.000Z')
      await expect(databaseConnector.storeLastUpdate(date, context)).rejects.toThrowError()
    })
    it('should override multiple lastUpdates of the same context', async () => {
      const context = new DatabaseContext('tcc', 'de')
      const date = moment('2011-05-04T00:00:00.000Z')
      const date2 = moment('2012-05-04T00:00:00.000Z')
      await databaseConnector.storeLastUsage(context, false)
      await databaseConnector.storeLastUpdate(date, context)
      await databaseConnector.storeLastUpdate(date2, context)
      expect(date2).toStrictEqual(await databaseConnector.loadLastUpdate(context))
    })
    it('should store the json file in the correct path', async () => {
      const context = new DatabaseContext('tcc', 'de')
      const date = moment('2011-05-04T00:00:00.000Z')
      await databaseConnector.storeLastUsage(context, false)
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
    it('should throw error if categories are not persisted', async () => {
      const context = new DatabaseContext('tcc', 'de')
      await expect(databaseConnector.loadCategories(context)).rejects.toThrowError()
    })
    it('should return a value that matches the one that was stored', async () => {
      const context = new DatabaseContext('tcc', 'de')
      await databaseConnector.storeCategories(testCategoriesMap, context)
      const categories = await databaseConnector.loadCategories(context)
      expect(categories.isEqual(testCategoriesMap)).toBe(true)
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
    it('should throw error if languages are not persisted', async () => {
      const context = new DatabaseContext('tcc', 'de')
      await expect(databaseConnector.loadLanguages(context)).rejects.toThrowError()
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
    it('should throw error if events are not persisted', async () => {
      const context = new DatabaseContext('tcc', 'de')
      await expect(databaseConnector.loadEvents(context)).rejects.toThrowError()
    })
    it('should return a value that matches the one that was stored', async () => {
      const context = new DatabaseContext('tcc', 'de')
      await databaseConnector.storeEvents(testEvents, context)
      const events = await databaseConnector.loadEvents(context)
      expect(events.every((event, i) => event.isEqual(testEvents[i]))).toBeTruthy()
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

  const expectExists = async (path: string, exists = true) => {
    const doesExist = await RNFetchBlob.fs.exists(path)
    expect(doesExist).toBe(exists)
  }

  const expectCityFilesExist = async (city: string, exists = true) => {
    const context = new DatabaseContext(city, null)
    const resourcePath = databaseConnector.getResourceCachePath(context)
    await expectExists(resourcePath, exists)
    const contentPath = databaseConnector.getContentPath('categories', context)
    await expectExists(contentPath, exists)
  }

  const populateCityContent = async (city: string) => {
    const context = new DatabaseContext(city, null)
    await databaseConnector.storeResourceCache(testResources, context)
    await databaseConnector.storeCategories(testCategoriesMap, context)
  }

  describe('storeLastUsage', () => {
    it('should store the usage of the passed city', async () => {
      const date = moment('2014-05-04T00:00:00.000Z')
      const { restoreDate } = mockDate(date)
      const context = new DatabaseContext('augsburg', null)
      await databaseConnector.storeLastUsage(context, false)
      expect(JSON.parse(await RNFetchBlob.fs.readFile(databaseConnector.getMetaCitiesPath(), ''))).toEqual({
        augsburg: {
          last_usage: date.toISOString(),
          languages: {}
        }
      })
      restoreDate()
    })
    it('should not delete old cities if peeking', async () => {
      await populateCityContent('muenchen')
      await populateCityContent('dortmund')
      await populateCityContent('ansbach')
      await populateCityContent('regensburg')
      // We have to write this manually, since this is normally done in storeLastUsage, but it calls deleteOldFiles
      await RNFetchBlob.fs.writeFile(
        databaseConnector.getMetaCitiesPath(),
        JSON.stringify({
          muenchen: {
            languages: {},
            last_usage: '2010-05-04T00:00:00.000Z'
          },
          dortmund: {
            languages: {},
            last_usage: '2011-05-04T00:00:00.000Z'
          },
          ansbach: {
            languages: {},
            last_usage: '2012-05-04T00:00:00.000Z'
          }
        }),
        ''
      )
      const { restoreDate } = mockDate(moment('2013-05-04T00:00:00.000Z'))
      await databaseConnector.storeLastUsage(new DatabaseContext('regensburg', null), true)
      await expectCityFilesExist('muenchen')
      await expectCityFilesExist('dortmund')
      await expectCityFilesExist('ansbach')
      await expectCityFilesExist('regensburg')
      expect(JSON.parse(await RNFetchBlob.fs.readFile(databaseConnector.getMetaCitiesPath(), ''))).toEqual({
        muenchen: {
          languages: {},
          last_usage: '2010-05-04T00:00:00.000Z'
        },
        ansbach: {
          languages: {},
          last_usage: '2012-05-04T00:00:00.000Z'
        },
        dortmund: {
          languages: {},
          last_usage: '2011-05-04T00:00:00.000Z'
        },
        regensburg: {
          languages: {},
          last_usage: '2013-05-04T00:00:00.000Z'
        }
      })
      restoreDate()
    })
    it('should delete old files if there are more than MAX_STORED_CITIES and not peeking', async () => {
      await populateCityContent('muenchen')
      await populateCityContent('dortmund')
      await populateCityContent('ansbach')
      await populateCityContent('regensburg')
      // We have to write this manually, since this is normally done in storeLastUsage, but it calls deleteOldFiles
      await RNFetchBlob.fs.writeFile(
        databaseConnector.getMetaCitiesPath(),
        JSON.stringify({
          muenchen: {
            languages: {},
            last_usage: '2010-05-04T00:00:00.000Z'
          },
          dortmund: {
            languages: {},
            last_usage: '2011-05-04T00:00:00.000Z'
          },
          ansbach: {
            languages: {},
            last_usage: '2012-05-04T00:00:00.000Z'
          }
        }),
        ''
      )
      const { restoreDate } = mockDate(moment('2013-05-04T00:00:00.000Z'))
      await databaseConnector.storeLastUsage(new DatabaseContext('regensburg', null), false)
      await expectCityFilesExist('muenchen', false)
      await expectCityFilesExist('dortmund')
      await expectCityFilesExist('ansbach')
      await expectCityFilesExist('regensburg')
      expect(JSON.parse(await RNFetchBlob.fs.readFile(databaseConnector.getMetaCitiesPath(), ''))).toEqual({
        ansbach: {
          languages: {},
          last_usage: '2012-05-04T00:00:00.000Z'
        },
        dortmund: {
          languages: {},
          last_usage: '2011-05-04T00:00:00.000Z'
        },
        regensburg: {
          languages: {},
          last_usage: '2013-05-04T00:00:00.000Z'
        }
      })
      restoreDate()
    })
    it('should override if persisted data is malformatted for a given city-language pair', async () => {
      const context = new DatabaseContext('tcc', 'de')
      const path = databaseConnector.getMetaCitiesPath()
      RNFetchBlob.fs.writeFile(path, '{ "i": "am": "malformatted" } }', 'utf8')
      const { restoreDate } = mockDate(moment('2013-05-04T00:00:00.000Z'))
      await databaseConnector.storeLastUsage(context, false)
      expect(JSON.parse(await RNFetchBlob.fs.readFile(path, 'utf8'))).toEqual({
        tcc: {
          languages: {},
          last_usage: '2013-05-04T00:00:00.000Z'
        }
      })
      restoreDate()
    })
  })
  describe('loadLastUsages', () => {
    it('should load last usages', async () => {
      await RNFetchBlob.fs.writeFile(
        databaseConnector.getMetaCitiesPath(),
        JSON.stringify({
          muenchen: {
            languages: {},
            last_usage: '2010-05-04T00:00:00.000Z'
          },
          dortmund: {
            languages: {},
            last_usage: '2011-05-04T00:00:00.000Z'
          },
          ansbach: {
            languages: {},
            last_usage: '2012-05-04T00:00:00.000Z'
          },
          augsburg: {
            languages: {},
            last_usage: '2014-05-04T00:00:00.000Z'
          },
          regensburg: {
            languages: {},
            last_usage: '2013-05-04T00:00:00.000Z'
          }
        }),
        ''
      )
      expect(await databaseConnector.loadLastUsages()).toEqual([
        {
          city: 'muenchen',
          lastUsage: moment('2010-05-04T00:00:00.000Z')
        },
        {
          city: 'dortmund',
          lastUsage: moment('2011-05-04T00:00:00.000Z')
        },
        {
          city: 'ansbach',
          lastUsage: moment('2012-05-04T00:00:00.000Z')
        },
        {
          city: 'augsburg',
          lastUsage: moment('2014-05-04T00:00:00.000Z')
        },
        {
          city: 'regensburg',
          lastUsage: moment('2013-05-04T00:00:00.000Z')
        }
      ])
    })
    it('should return empty array if persisted data is malformatted', async () => {
      const path = databaseConnector.getMetaCitiesPath()
      RNFetchBlob.fs.writeFile(path, '{ "i": "am": "malformatted" } }', 'utf8')
      const usages = await databaseConnector.loadLastUsages()
      expect(usages).toEqual([])
    })
  })
  describe('deleteOldFiles', () => {
    it('should keep only the maximal number of caches and files', async () => {
      await populateCityContent('muenchen')
      await populateCityContent('dortmund')
      await populateCityContent('ansbach')
      await populateCityContent('regensburg')
      await populateCityContent('augsburg')
      // We have to write this manually, since this is normally done in storeLastUsage, but it calls deleteOldFiles
      await RNFetchBlob.fs.writeFile(
        databaseConnector.getMetaCitiesPath(),
        JSON.stringify({
          muenchen: {
            languages: {},
            last_usage: '2010-05-04T00:00:00.000Z'
          },
          dortmund: {
            languages: {},
            last_usage: '2011-05-04T00:00:00.000Z'
          },
          ansbach: {
            languages: {},
            last_usage: '2012-05-04T00:00:00.000Z'
          },
          augsburg: {
            languages: {},
            last_usage: '2014-05-04T00:00:00.000Z'
          },
          regensburg: {
            languages: {},
            last_usage: '2013-05-04T00:00:00.000Z'
          }
        }),
        ''
      )
      await databaseConnector.deleteOldFiles(new DatabaseContext('augsburg', null))
      await expectCityFilesExist('muenchen', false)
      await expectCityFilesExist('dortmund', false)
      await expectCityFilesExist('ansbach')
      await expectCityFilesExist('regensburg')
      await expectCityFilesExist('augsburg')
      expect(JSON.parse(await RNFetchBlob.fs.readFile(databaseConnector.getMetaCitiesPath(), ''))).toEqual({
        ansbach: {
          languages: {},
          last_usage: '2012-05-04T00:00:00.000Z'
        },
        augsburg: {
          languages: {},
          last_usage: '2014-05-04T00:00:00.000Z'
        },
        regensburg: {
          languages: {},
          last_usage: '2013-05-04T00:00:00.000Z'
        }
      })
    })
    it('should not delete the resource cache of the same city', async () => {
      await populateCityContent('augsburg')
      await populateCityContent('dortmund')
      await populateCityContent('ansbach')
      await populateCityContent('regensburg')
      // We have to write this manually, since this is normally done in storeLastUsage, but it calls deleteOldFiles
      await RNFetchBlob.fs.writeFile(
        databaseConnector.getMetaCitiesPath(),
        JSON.stringify({
          augsburg: {
            languages: {},
            last_usage: '2010-05-04T00:00:00.000Z'
          },
          dortmund: {
            languages: {},
            last_usage: '2011-05-04T00:00:00.000Z'
          },
          ansbach: {
            languages: {},
            last_usage: '2012-05-04T00:00:00.000Z'
          },
          regensburg: {
            languages: {},
            last_usage: '2013-05-04T00:00:00.000Z'
          }
        }),
        ''
      )
      await databaseConnector.deleteOldFiles(new DatabaseContext('augsburg', null))
      await expectCityFilesExist('dortmund', false)
      await expectCityFilesExist('ansbach')
      await expectCityFilesExist('regensburg')
      await expectCityFilesExist('augsburg')
      expect(JSON.parse(await RNFetchBlob.fs.readFile(databaseConnector.getMetaCitiesPath(), ''))).toEqual({
        ansbach: {
          languages: {},
          last_usage: '2012-05-04T00:00:00.000Z'
        },
        augsburg: {
          languages: {},
          last_usage: '2010-05-04T00:00:00.000Z'
        },
        regensburg: {
          languages: {},
          last_usage: '2013-05-04T00:00:00.000Z'
        }
      })
    })
  })
})
