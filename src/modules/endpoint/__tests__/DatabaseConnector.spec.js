// @flow

import { CityModel } from '@integreat-app/integreat-api-client'
import DatabaseConnector from '../DatabaseConnector'
import moment from 'moment-timezone'
import DatabaseContext from '../DatabaseContext'
import RNFetchBlob from 'rn-fetch-blob'

jest.mock('rn-fetch-blob')
const databaseConnector = new DatabaseConnector()

beforeEach(() => {
  RNFetchBlob.fs.reset()
})

describe('city database', () => {
  const testCity = new CityModel({
    name: 'testCityName',
    code: 'tcc',
    live: true,
    eventsEnabled: true,
    extrasEnabled: true,
    sortingName: 'testCity',
    prefix: 'Stadt'
  })
  it('cities should not be persisted', async () => {
    return databaseConnector.isCitiesPersisted().then(isPersisted => {
      expect(isPersisted).toBe(false)
    })
  })

  it('storeCities should throw exception if the data you want to save is empty', async () => {
    expect(databaseConnector.storeCities([null])).rejects.toThrowError()
  })

  it('loadCities should throw exception if path does not exist', async () => {
    expect(databaseConnector.loadCities()).rejects.toThrowError()
  })

  it('cities should be persisted after storeCities is called', async () => {
    await databaseConnector.storeCities([testCity])

    return databaseConnector.isCitiesPersisted().then(isPersisted => {
      expect(isPersisted).toBe(true)
    })
  })

  it('loaded and stored data should be equal', async () => {
    await databaseConnector.storeCities([testCity])

    return databaseConnector.loadCities().then(cities => {
      expect(cities).toStrictEqual([testCity])
    })
  })

  it('loadLastUpdate should return null', async () => {
    const context = new DatabaseContext('tcc', 'de')

    return databaseConnector.loadLastUpdate(context).then(moment => {
      expect(moment).toBeNull()
    })
  })
})
