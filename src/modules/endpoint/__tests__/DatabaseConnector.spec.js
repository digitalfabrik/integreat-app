// @flow
import {CityModel} from '@integreat-app/integreat-api-client'
import DatabaseConnector from '../DatabaseConnector'

jest.mock('rn-fetch-blob');

describe('databaseConnector', () => {
  const dbCon = new DatabaseConnector()

  const MOCK_FILE_INFO = {
    '/path/to/cities.json': 'console.log("file1 contents");',
  };

  beforeEach(() => {
    // Set up some mocked out file info before each test
    require('rn-fetch-blob').__setMockFiles(MOCK_FILE_INFO);
  });

  afterEach(() => {
    jest.resetModules()
  })

  it('should save and read city data', () => {
    const testCity = new CityModel({
      name: 'testCityName',
      code: 'tcc',
      live: true,
      eventsEnabled: true,
      extrasEnabled: true,
      sortingName: 'testCity',
      prefix: 'Stadt'
    })

    //store city
    dbCon.storeCities([testCity])

    return dbCon.loadCities().then(cities => {
      expect(cities).toBe([testCity])
    })
  })
})
