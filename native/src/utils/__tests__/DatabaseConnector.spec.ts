import { waitFor } from '@testing-library/react-native'
import { DateTime } from 'luxon'
import { rrulestr } from 'rrule'

import { DateModel, EventModel } from 'shared/api'
import CategoriesMapModelBuilder from 'shared/api/endpoints/testing/CategoriesMapModelBuilder'
import CityModelBuilder from 'shared/api/endpoints/testing/CityModelBuilder'
import EventModelBuilder from 'shared/api/endpoints/testing/EventModelBuilder'

import BlobUtil from '../../__mocks__/react-native-blob-util'
import DatabaseContext from '../../models/DatabaseContext'
import DatabaseConnector, {
  RESOURCE_CACHE_DIR_PATH,
  UNVERSIONED_CONTENT_DIR_PATH,
  UNVERSIONED_RESOURCE_CACHE_DIR_PATH,
} from '../DatabaseConnector'

const now = DateTime.fromISO('2024-05-02T11:45:43.443+02:00')
jest.useFakeTimers({ now: now.toJSDate() })

const databaseConnector = new DatabaseConnector()
afterEach(() => {
  BlobUtil.fs._reset()
  jest.clearAllMocks()
})

const t = (key: string, options?: Record<string, unknown>) =>
  options
    ? `${key}, ${Object.entries(options)
        .map(option => `${option[0]}: ${option[1]}`)
        .join(', ')}`
    : key

describe('DatabaseConnector', () => {
  const city = 'augsburg'
  const language = 'de'
  const testCities = new CityModelBuilder(2).build()
  const testCategoriesMap = new CategoriesMapModelBuilder(city, language, 2, 2).build()
  const testEvents = new EventModelBuilder('testSeed', 2, city, language).build()
  const testResources = {
    de: {
      'https://test.de/path/to/resource/test.png': '/local/path/to/resource/b4b5dca65e423.png',
      'https://test.de/path/to/resource/test2.jpg': '/local/path/to/resource/970c65c41eac0.jpg',
    },
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
      expect(BlobUtil.fs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('/cities.json'),
        expect.any(String),
        expect.any(String),
      )
    })
  })

  describe('loadCities', () => {
    it('should throw exception if cities are not persisted', async () => {
      await expect(databaseConnector.loadCities()).rejects.toThrow()
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
      const dateTime = await databaseConnector.loadLastUpdate(context)
      expect(dateTime).toBeNull()
    })

    it('should throw if persisted data is malformed for a given city-language pair', async () => {
      const context = new DatabaseContext('tcc', 'de')
      BlobUtil.fs.writeFile(databaseConnector.getMetaCitiesPath(), '{ "i": "am": "malformed" } }', 'utf8')
      await expect(databaseConnector.loadLastUpdate(context)).rejects.toThrow()
    })

    it('should throw error if currentCity in context is null', async () => {
      const context = new DatabaseContext(undefined, 'de')
      await expect(databaseConnector.loadLastUpdate(context)).rejects.toThrow()
    })

    it('should throw error if currentLanguage is null', async () => {
      const context = new DatabaseContext('tcc')
      await expect(databaseConnector.loadLastUpdate(context)).rejects.toThrow()
    })

    it('should return a DateTime that matches the one that was stored', async () => {
      const context = new DatabaseContext('tcc', 'de')
      const dateExpected = DateTime.fromISO('2011-05-04T00:00:00.000Z')
      await databaseConnector.storeLastUsage(context)
      await databaseConnector.storeLastUpdate(dateExpected, context)
      expect(dateExpected).toStrictEqual(await databaseConnector.loadLastUpdate(context))
    })
  })

  describe('storeLastUpdate', () => {
    it('should throw error if currentCity in context is null', async () => {
      const context = new DatabaseContext(undefined, 'de')
      const date = DateTime.fromISO('2011-05-04T00:00:00.000Z')
      await expect(databaseConnector.storeLastUpdate(date, context)).rejects.toThrow()
    })

    it('should throw error if currentLanguage in context is null', async () => {
      const context = new DatabaseContext('tcc')
      const date = DateTime.fromISO('2011-05-04T00:00:00.000Z')
      await expect(databaseConnector.storeLastUpdate(date, context)).rejects.toThrow()
    })

    it('should throw error if meta of city is null', async () => {
      const context = new DatabaseContext('tcc')
      const date = DateTime.fromISO('2011-05-04T00:00:00.000Z')
      await expect(databaseConnector.storeLastUpdate(date, context)).rejects.toThrow()
    })

    it('should override multiple lastUpdates of the same context', async () => {
      const context = new DatabaseContext('tcc', 'de')
      const date = DateTime.fromISO('2011-05-04T00:00:00.000Z')
      const date2 = DateTime.fromISO('2012-05-04T00:00:00.000Z')
      await databaseConnector.storeLastUsage(context)
      await databaseConnector.storeLastUpdate(date, context)
      await databaseConnector.storeLastUpdate(date2, context)
      expect(date2).toStrictEqual(await databaseConnector.loadLastUpdate(context))
    })

    it('should store the json file in the correct path', async () => {
      const context = new DatabaseContext('tcc', 'de')
      const date = DateTime.fromISO('2011-05-04T00:00:00.000Z')
      await databaseConnector.storeLastUsage(context)
      await databaseConnector.storeLastUpdate(date, context)
      expect(BlobUtil.fs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('cities-meta.json'),
        expect.any(String),
        expect.any(String),
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
      expect(BlobUtil.fs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('tcc/de/categories.json'),
        expect.any(String),
        expect.any(String),
      )
    })
  })

  describe('loadCategories', () => {
    it('should throw error if categories are not persisted', async () => {
      const context = new DatabaseContext('tcc', 'de')
      await expect(databaseConnector.loadCategories(context)).rejects.toThrow()
    })

    it('should return a value that matches the one that was stored', async () => {
      const context = new DatabaseContext('tcc', 'de')
      await databaseConnector.storeCategories(testCategoriesMap, context)
      const categories = await databaseConnector.loadCategories(context)
      expect(categories.isEqual(testCategoriesMap)).toBe(true)
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
      expect(BlobUtil.fs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('tcc/de/events.json'),
        expect.any(String),
        expect.any(String),
      )
    })
  })

  describe('loadEvents', () => {
    it('should throw error if events are not persisted', async () => {
      const context = new DatabaseContext('tcc', 'de')
      await expect(databaseConnector.loadEvents(context)).rejects.toThrow()
    })

    it('should return a value that matches the one that was stored', async () => {
      const context = new DatabaseContext('tcc', 'de')
      await databaseConnector.storeEvents(testEvents, context)
      const events = await databaseConnector.loadEvents(context)
      expect(events.every((event, i) => event.isEqual(testEvents[i]!))).toBeTruthy()
    })

    it('should correctly persist and load event dates', async () => {
      const context = new DatabaseContext('tcc', 'de')
      await databaseConnector.storeEvents(testEvents, context)
      const events = await databaseConnector.loadEvents(context)
      expect(events.every((event, i) => event.isEqual(testEvents[i]!))).toBeTruthy()
    })

    it('should correctly keep offset over recurrences', async () => {
      const context = new DatabaseContext('tcc', 'de')
      const recurrenceRule = rrulestr('DTSTART:20240116T090000\nRRULE:FREQ=WEEKLY;BYDAY=TU')
      const date = new DateModel({
        startDate: DateTime.fromISO('2024-01-16T10:00:00+01:00'),
        endDate: DateTime.fromISO('2024-01-16T12:00:00+01:00'),
        allDay: false,
        recurrenceRule,
        onlyWeekdays: false,
      })
      const event = new EventModel({
        path: '/augsburg/de/events/asylpolitischer_fruehschoppen',
        title: 'Asylpolitischer Frühschoppen',
        excerpt: 'Asylpolitischer Frühschoppen',
        content: '<div>Some event test content :)</div>',
        availableLanguages: {},
        thumbnail: '',
        date,
        location: null,
        lastUpdate: DateTime.fromISO('2022-06-29T09:19:57.443+02:00'),
        featuredImage: null,
        poiPath: '/testumgebung/de/locations/testort/',
        meetingUrl: null,
      })

      const expectedDate = {
        date: 'startingFrom, date: 7. Mai 2024',
        time: '10:00 - 12:00',
        weekday: 'Dienstag',
      }

      expect(event.date.formatEventDate('de', t)).toStrictEqual(expectedDate)
      expect(event.date.recurrences(1)[0]!.formatEventDate('de', t)).toStrictEqual(expectedDate)

      await databaseConnector.storeEvents([event], context)
      const loadedEvent = (await databaseConnector.loadEvents(context))[0]!

      expect(loadedEvent.date.formatEventDate('de', t)).toStrictEqual(expectedDate)
      expect(loadedEvent.date.recurrences(1)[0]!.formatEventDate('de', t)).toStrictEqual(expectedDate)
    })
  })

  describe('storeResourceCache', () => {
    it('should store the json file in the correct path', async () => {
      const context = new DatabaseContext('tcc', 'de')
      await databaseConnector.storeResourceCache(testResources, context)
      expect(BlobUtil.fs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('tcc/files.json'),
        expect.any(String),
        expect.any(String),
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
    const doesExist = await BlobUtil.fs.exists(path)
    expect(doesExist).toBe(exists)
  }

  const expectCityFilesExist = async (city: string, exists = true) => {
    const context = new DatabaseContext(city)
    const resourcePath = databaseConnector.getResourceCachePath(context)
    await expectExists(resourcePath, exists)
    const contentPath = databaseConnector.getContentPath('categories', context)
    await expectExists(contentPath, exists)
  }

  const populateCityContent = async (city: string) => {
    const context = new DatabaseContext(city)
    await databaseConnector.storeResourceCache(testResources, context)
    await databaseConnector.storeCategories(testCategoriesMap, context)
  }

  describe('storeLastUsage', () => {
    it('should store the usage of the passed city', async () => {
      const context = new DatabaseContext('augsburg')
      await databaseConnector.storeLastUsage(context)
      expect(JSON.parse(await BlobUtil.fs.readFile(databaseConnector.getMetaCitiesPath(), ''))).toEqual({
        augsburg: {
          lastUsage: now.toISO(),
          languages: {},
        },
      })
    })

    it('should delete old files if there are more than MAX_STORED_CITIES', async () => {
      await populateCityContent('muenchen')
      await populateCityContent('dortmund')
      await populateCityContent('ansbach')
      await populateCityContent('regensburg')
      // We have to write this manually, since this is normally done in storeLastUsage, but it calls deleteOldFiles
      await BlobUtil.fs.writeFile(
        databaseConnector.getMetaCitiesPath(),
        JSON.stringify({
          muenchen: {
            languages: {},
            lastUsage: '2010-05-04T00:00:00.000',
          },
          dortmund: {
            languages: {},
            lastUsage: '2011-05-04T00:00:00.000',
          },
          ansbach: {
            languages: {},
            lastUsage: '2012-05-04T00:00:00.000',
          },
        }),
        '',
      )
      await databaseConnector.storeLastUsage(new DatabaseContext('regensburg'))
      await expectCityFilesExist('muenchen', false)
      await expectCityFilesExist('dortmund')
      await expectCityFilesExist('ansbach')
      await expectCityFilesExist('regensburg')
      expect(JSON.parse(await BlobUtil.fs.readFile(databaseConnector.getMetaCitiesPath(), ''))).toEqual({
        ansbach: {
          languages: {},
          lastUsage: '2012-05-04T00:00:00.000+02:00',
        },
        dortmund: {
          languages: {},
          lastUsage: '2011-05-04T00:00:00.000+02:00',
        },
        regensburg: {
          languages: {},
          lastUsage: '2024-05-02T11:45:43.443+02:00',
        },
      })
    })

    it('should override if persisted data is malformed for a given city-language pair', async () => {
      const context = new DatabaseContext('tcc', 'de')
      const path = databaseConnector.getMetaCitiesPath()
      BlobUtil.fs.writeFile(path, '{ "i": "am": "malformed" } }', 'utf8')
      await databaseConnector.storeLastUsage(context)
      expect(JSON.parse(await BlobUtil.fs.readFile(path, 'utf8'))).toEqual({
        tcc: {
          languages: {},
          lastUsage: '2024-05-02T11:45:43.443+02:00',
        },
      })
    })
  })

  describe('loadLastUsages', () => {
    it('should load last usages', async () => {
      await BlobUtil.fs.writeFile(
        databaseConnector.getMetaCitiesPath(),
        JSON.stringify({
          muenchen: {
            languages: {},
            lastUsage: '2010-05-04T00:00:00.000',
          },
          dortmund: {
            languages: {},
            lastUsage: '2011-05-04T00:00:00.000',
          },
          ansbach: {
            languages: {},
            lastUsage: '2012-05-04T00:00:00.000',
          },
          augsburg: {
            languages: {},
            lastUsage: '2014-05-04T00:00:00.000',
          },
          regensburg: {
            languages: {},
            lastUsage: '2013-05-04T00:00:00.000',
          },
        }),
        '',
      )
      expect(await databaseConnector.loadLastUsages()).toEqual([
        {
          city: 'muenchen',
          lastUsage: DateTime.fromISO('2010-05-04T00:00:00.000'),
        },
        {
          city: 'dortmund',
          lastUsage: DateTime.fromISO('2011-05-04T00:00:00.000'),
        },
        {
          city: 'ansbach',
          lastUsage: DateTime.fromISO('2012-05-04T00:00:00.000'),
        },
        {
          city: 'augsburg',
          lastUsage: DateTime.fromISO('2014-05-04T00:00:00.000'),
        },
        {
          city: 'regensburg',
          lastUsage: DateTime.fromISO('2013-05-04T00:00:00.000'),
        },
      ])
    })

    it('should throw array if persisted data is malformed', async () => {
      const path = databaseConnector.getMetaCitiesPath()
      BlobUtil.fs.writeFile(path, '{ "i": "am": "malformed" } }', 'utf8')
      await expect(databaseConnector.loadLastUsages()).rejects.toThrow()
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
      await BlobUtil.fs.writeFile(
        databaseConnector.getMetaCitiesPath(),
        JSON.stringify({
          muenchen: {
            languages: {},
            lastUsage: '2010-05-04T00:00:00.000',
          },
          dortmund: {
            languages: {},
            lastUsage: '2011-05-04T00:00:00.000',
          },
          ansbach: {
            languages: {},
            lastUsage: '2012-05-04T00:00:00.000',
          },
          augsburg: {
            languages: {},
            lastUsage: '2014-05-04T00:00:00.000',
          },
          regensburg: {
            languages: {},
            lastUsage: '2013-05-04T00:00:00.000',
          },
        }),
        '',
      )
      await databaseConnector.deleteOldFiles(new DatabaseContext('augsburg'))
      await expectCityFilesExist('muenchen', false)
      await expectCityFilesExist('dortmund', false)
      await expectCityFilesExist('ansbach')
      await expectCityFilesExist('regensburg')
      await expectCityFilesExist('augsburg')
      expect(JSON.parse(await BlobUtil.fs.readFile(databaseConnector.getMetaCitiesPath(), ''))).toEqual({
        ansbach: {
          languages: {},
          lastUsage: '2012-05-04T00:00:00.000+02:00',
        },
        augsburg: {
          languages: {},
          lastUsage: '2014-05-04T00:00:00.000+02:00',
        },
        regensburg: {
          languages: {},
          lastUsage: '2013-05-04T00:00:00.000+02:00',
        },
      })
    })

    it('should not delete the resource cache of the same city', async () => {
      await populateCityContent('augsburg')
      await populateCityContent('dortmund')
      await populateCityContent('ansbach')
      await populateCityContent('regensburg')
      // We have to write this manually, since this is normally done in storeLastUsage, but it calls deleteOldFiles
      await BlobUtil.fs.writeFile(
        databaseConnector.getMetaCitiesPath(),
        JSON.stringify({
          augsburg: {
            languages: {},
            lastUsage: '2010-05-04T00:00:00.000',
          },
          dortmund: {
            languages: {},
            lastUsage: '2011-05-04T00:00:00.000',
          },
          ansbach: {
            languages: {},
            lastUsage: '2012-05-04T00:00:00.000',
          },
          regensburg: {
            languages: {},
            lastUsage: '2013-05-04T00:00:00.000',
          },
        }),
        '',
      )
      await databaseConnector.deleteOldFiles(new DatabaseContext('augsburg'))
      await expectCityFilesExist('dortmund', false)
      await expectCityFilesExist('ansbach')
      await expectCityFilesExist('regensburg')
      await expectCityFilesExist('augsburg')
      expect(JSON.parse(await BlobUtil.fs.readFile(databaseConnector.getMetaCitiesPath(), ''))).toEqual({
        ansbach: {
          languages: {},
          lastUsage: '2012-05-04T00:00:00.000+02:00',
        },
        augsburg: {
          languages: {},
          lastUsage: '2010-05-04T00:00:00.000+02:00',
        },
        regensburg: {
          languages: {},
          lastUsage: '2013-05-04T00:00:00.000+02:00',
        },
      })
    })
  })

  describe('readFile', () => {
    it('should correctly read file and parse json content', async () => {
      const content = ['this', 'is', 'my', 'custom', { content: 'CONTENT' }]
      const path = 'my-path'
      await BlobUtil.fs.writeFile(path, JSON.stringify(content), 'utf8')
      const readContent = await databaseConnector.readFile(path, content => content)
      expect(readContent).toEqual(content)
    })

    it('should delete file if json is corrupted', async () => {
      const path = 'my-path'
      await BlobUtil.fs.writeFile(path, '[', 'utf8')
      await expect(databaseConnector.readFile(path, content => content)).rejects.toEqual(
        new SyntaxError('Unexpected end of JSON input'),
      )
      expect(BlobUtil.fs.unlink).toHaveBeenCalledWith(path)
    })

    it('should delete file if json cannot be mapped', async () => {
      const path = 'my-path'
      await BlobUtil.fs.writeFile(path, `[{ "_code": "de", "_name": "Deutsch" }]`, 'utf8')
      await expect(databaseConnector.readFile<string, string>(path, content => content.toLowerCase())).rejects.toEqual(
        new TypeError('content.toLowerCase is not a function'),
      )
      expect(BlobUtil.fs.unlink).toHaveBeenCalledWith(path)
    })
  })

  describe('migration routine', () => {
    it('should delete old content dir if version is upgraded', async () => {
      BlobUtil.fs.isDir.mockImplementation(async path => path === UNVERSIONED_CONTENT_DIR_PATH)
      const _ = new DatabaseConnector()
      await waitFor(() => expect(BlobUtil.fs.unlink).toHaveBeenCalledWith(UNVERSIONED_CONTENT_DIR_PATH))
    })

    it('should delete old resource cache dir if version is upgraded', async () => {
      BlobUtil.fs.isDir.mockImplementation(async path => path === UNVERSIONED_RESOURCE_CACHE_DIR_PATH)
      const _ = new DatabaseConnector()
      await waitFor(() => expect(BlobUtil.fs.unlink).toHaveBeenCalledWith(UNVERSIONED_RESOURCE_CACHE_DIR_PATH))
    })

    it('should not delete current cache if new version exists', async () => {
      BlobUtil.fs.isDir.mockImplementation(async () => true)
      const _ = new DatabaseConnector()
      await waitFor(() => expect(BlobUtil.fs.isDir).toHaveBeenCalledWith(RESOURCE_CACHE_DIR_PATH))
      expect(BlobUtil.fs.unlink).not.toHaveBeenCalled()
    })
  })
})
