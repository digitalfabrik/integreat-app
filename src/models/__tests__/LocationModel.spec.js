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

    it('should include the name if available', () => {
      const location = new LocationModel({
        name: 'Café Tür an Tür',
        address: 'Wertachstr. 29',
        town: 'Augsburg',
        state: 'Bayern',
        postcode: '86353',
        region: 'Schwaben',
        country: 'DE'
      })
      expect(location.location).toEqual('Café Tür an Tür, Wertachstr. 29, 86353 Augsburg')
    })

    it('should exclude the name if unavailable', () => {
      const location = new LocationModel({
        name: null,
        address: 'Wertachstr. 29',
        town: 'Augsburg',
        state: 'Bayern',
        postcode: '86353',
        region: 'Schwaben',
        country: 'DE'
      })
      expect(location.location).toEqual('Wertachstr. 29, 86353 Augsburg')
    })
  })
})
