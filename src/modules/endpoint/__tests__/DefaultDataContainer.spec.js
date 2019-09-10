// @flow

import DefaultDataContainer from '../DefaultDataContainer'
import {
  CategoryModel,
  CityModel,
  LanguageModel,
  CategoriesMapModel,
  EventModel, DateModel, LocationModel
} from '@integreat-app/integreat-api-client'
import DatabaseContext from '../DatabaseContext'
import RNFetchBlob from '../../../__mocks__/rn-fetch-blob'
import moment from 'moment-timezone'

jest.mock('rn-fetch-blob')

beforeEach(() => {
  RNFetchBlob.fs._reset()
})

const testCity = new CityModel({
  name: 'testCityName',
  code: 'tcc',
  live: true,
  eventsEnabled: true,
  extrasEnabled: true,
  sortingName: 'testCity',
  prefix: 'Stadt'
})

const testLanguage = new LanguageModel({
  code: 'de',
  name: 'deutsch'
})

const anotherTestLanguage = new LanguageModel({
  code: 'en',
  name: 'english'
})

const testCategory = new CategoryModel({
  root: true,
  path: 'test/path',
  title: 'testCategory',
  content: 'test content',
  thumbnail: 'thumbnail.png',
  parentPath: '',
  order: 1,
  availableLanguages: new Map<string, string>([]),
  lastUpdate: moment('2011-02-04T23:00:00.000Z', moment.ISO_8601),
  hash: 'testHash'
})

const anotherTestCategory = new CategoryModel({
  root: true,
  path: 'test/path',
  title: 'anotherTestCategory',
  content: 'test content',
  thumbnail: 'thumbnail.png',
  parentPath: '',
  order: 1,
  availableLanguages: new Map<string, string>([]),
  lastUpdate: moment('2011-03-04T23:00:00.000Z', moment.ISO_8601),
  hash: 'testHash'
})

const testEvent = new EventModel({
  path: 'test/path',
  title: 'testEvent',
  content: 'testContent',
  thumbnail: 'thumbnail.png',
  date: new DateModel({
    startDate: moment('2011-02-04T23:00:00.000Z', moment.ISO_8601),
    endDate: moment('2011-02-05T23:00:00.000Z', moment.ISO_8601),
    allDay: true
  }),
  location: new LocationModel({
    address: 'testStreet 2',
    town: 'testTown',
    postcode: '12345',
    latitude: null,
    longitude: null
  }),
  excerpt: 'TestEvent',
  availableLanguages: new Map<string, string>([]),
  lastUpdate: moment('2011-02-04T23:00:00.000Z', moment.ISO_8601),
  hash: 'testHash'
})

const anotherTestEvent = new EventModel({
  path: 'test/path',
  title: 'testEvent2',
  content: 'testContent',
  thumbnail: 'thumbnail.png',
  date: new DateModel({
    startDate: moment('2011-02-04T23:00:00.000Z', moment.ISO_8601),
    endDate: moment('2011-02-05T23:00:00.000Z', moment.ISO_8601),
    allDay: true
  }),
  location: new LocationModel({
    address: 'testStreet 2',
    town: 'testTown',
    postcode: '12345',
    latitude: null,
    longitude: null
  }),
  excerpt: 'TestEvent',
  availableLanguages: new Map<string, string>([]),
  lastUpdate: moment('2011-02-04T23:00:00.000Z', moment.ISO_8601),
  hash: 'testHash'
})

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
    }
  }
}

const anotherTestResources = {
  'de':
  {
    '/path/to/page2':
    {
      'https://test.de/path/to/anotherResource/test.png':
      {
        filePath: '/local/path/to/resource/b4b5dca65e424.png',
        lastUpdate: moment('2011-02-04T23:00:00.000Z', moment.ISO_8601),
        hash: 'testHash'
      }
    }
  }
}

describe('DefaultDataContainer', () => {
  describe('isCached', () => {
    it('should return true if CacheType is stored', async () => {
      const defaultDataContainer = new DefaultDataContainer()
      await defaultDataContainer.setCities([testCity])
      expect(defaultDataContainer.isCached('cities', new DatabaseContext())).toBe(true)
    })
    it('should return false if CacheType is not stored', () => {
      const defaultDataContainer = new DefaultDataContainer()
      expect(defaultDataContainer.isCached('cities', new DatabaseContext())).toBe(false)
    })
  })
  it('should look at the file system if data is not persisted in the cache', async () => {
    const defaultDataContainer = new DefaultDataContainer()
    await defaultDataContainer.setCities([testCity])

    const anotherDataContainer = new DefaultDataContainer()

    await anotherDataContainer.getCities()
    expect(RNFetchBlob.fs.readFile).toHaveBeenCalled()
  })
  it('should return the language associated with the city', async () => {
    const defaultDataContainer = new DefaultDataContainer()
    await defaultDataContainer.setLanguages('testCity', [testLanguage])
    await defaultDataContainer.setLanguages('anotherTestCity', [anotherTestLanguage])

    const receivedTestLanguage = await defaultDataContainer.getLanguages('testCity')
    const receivedAnotherTestLanguage = await defaultDataContainer.getLanguages('anotherTestCity')

    expect(receivedTestLanguage).toEqual([testLanguage])
    expect(receivedAnotherTestLanguage).toEqual([anotherTestLanguage])
  })
  it('should return the category associated with the context', async () => {
    const defaultDataContainer = new DefaultDataContainer()
    await defaultDataContainer.setCategoriesMap('testCity', 'de', new CategoriesMapModel([testCategory]))
    await defaultDataContainer.setCategoriesMap('anotherTestCity', 'en', new CategoriesMapModel([anotherTestCategory]))

    const receivedTestCategories = await defaultDataContainer.getCategoriesMap('testCity', 'de')
    const receivedAnotherTestCategories = await defaultDataContainer.getCategoriesMap('anotherTestCity', 'en')

    expect(receivedTestCategories.toArray()).toEqual([testCategory])
    expect(receivedAnotherTestCategories.toArray()).toEqual([anotherTestCategory])
  })
  it('should return the events associated with the context', async () => {
    const defaultDataContainer = new DefaultDataContainer()
    await defaultDataContainer.setEvents('testCity', 'de', [testEvent])
    await defaultDataContainer.setEvents('anotherTestCity', 'en', [anotherTestEvent])

    const receivedTestEvents = await defaultDataContainer.getEvents('testCity', 'de')
    const receivedAnotherTestEvents = await defaultDataContainer.getEvents('anotherTestCity', 'en')

    expect(receivedTestEvents).toEqual([testEvent])
    expect(receivedAnotherTestEvents).toEqual([anotherTestEvent])
  })
  it('should return the resources associated with the context', async () => {
    const defaultDataContainer = new DefaultDataContainer()
    await defaultDataContainer.setResourceCache('testCity', 'de', testResources)
    await defaultDataContainer.setResourceCache('anotherTestCity', 'en', anotherTestResources)

    const receivedTestResources = await defaultDataContainer.getResourceCache('testCity', 'de')
    const receivedAnotherTestResources = await defaultDataContainer.getResourceCache('anotherTestCity', 'en')

    expect(receivedTestResources).toEqual({
      'de': {
        '/path/to/page': {
          'https://test.de/path/to/resource/test.png': {
            'filePath': '/local/path/to/resource/b4b5dca65e423.png',
            'hash': 'testHash',
            'lastUpdate': '2011-02-04T23:00:00.000Z'
          }
        }
      }
    })
    expect(receivedAnotherTestResources).toEqual({
      'de': {
        '/path/to/page2': {
          'https://test.de/path/to/anotherResource/test.png': {
            'filePath': '/local/path/to/resource/b4b5dca65e424.png',
            'hash': 'testHash',
            'lastUpdate': '2011-02-04T23:00:00.000Z'
          }
        }
      }
    })
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

  })
})
