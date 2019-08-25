// @flow

import { CityModel } from '@integreat-app/integreat-api-client'
import DatabaseConnector from '../DatabaseConnector'
import moment from 'moment-timezone'
import DatabaseContext from '../DatabaseContext'

jest.mock('rn-fetch-blob')
const dbCon = new DatabaseConnector()

describe('databaseConnector', () => {
  afterEach(() => {
    jest.resetModules()
  })

  it('should store/load city', async () => {
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
    await dbCon.storeCities([testCity])

    return dbCon.loadCities().then(cities => {
      expect(cities).toStrictEqual([testCity])
    })
  })
  it('should store/load lastUpdate', async () => {
    const date = moment('20110530')
    const context = new DatabaseContext('tcc', 'de')

    await dbCon.storeLastUpdate(date, context)

    return dbCon.loadLastUpdate(context).then(m => {
      expect(m.isSame(date)).toBeTruthy()
    })
  })
})
