// @flow

import LocationModel from '../LocationModel'

describe('LocationModel', () => {
  describe('location', () => {
    it('should return null if town is null', () => {
      expect(new LocationModel({
        name: null, address: null, town: null, postcode: null, latitude: null, longitude: null
      }).location).toBeNull()
    })

    it('should only return town (and postcode) if address is null', () => {
      expect(new LocationModel({
        name: null, address: null, town: 'Augsburg', postcode: '86161', latitude: null, longitude: null
      }).location).toBe('86161 Augsburg')

      expect(new LocationModel({
        name: null, address: null, town: 'Augsburg', postcode: null, latitude: null, longitude: null
      }).location).toBe('Augsburg')
    })

    it('should return full location', () => {
      expect(new LocationModel({
        name: null, address: 'Street 42', town: 'Augsburg', postcode: '86161', latitude: null, longitude: null
      }).location).toBe('Street 42, 86161 Augsburg')

      expect(new LocationModel({
        name: null, address: 'Street 42', town: 'Augsburg', postcode: null, latitude: null, longitude: null
      }).location).toBe('Street 42, Augsburg')
    })
  })
})
