// @flow

import { CityModel } from '@integreat-app/integreat-api-client'
import DatabaseConnector from '../DatabaseConnector'

jest.mock('rn-fetch-blob')
const dbCon = new DatabaseConnector()

describe('databaseConnector', () => {
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

    // store city
    dbCon.storeCities([testCity])

    return dbCon.loadCities().then(cities => {
      expect(cities).toStrictEqual([testCity])
    })
  })
})
