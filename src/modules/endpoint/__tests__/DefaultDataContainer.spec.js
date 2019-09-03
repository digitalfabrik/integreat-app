// @flow

import DefaultDataContainer from '../DefaultDataContainer'
import { CityModel } from '@integreat-app/integreat-api-client'
import DatabaseContext from '../DatabaseContext'

jest.mock('rn-fetch-blob')

const testCity = new CityModel({
  name: 'testCityName',
  code: 'tcc',
  live: true,
  eventsEnabled: true,
  extrasEnabled: true,
  sortingName: 'testCity',
  prefix: 'Stadt'
})

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
})
