// @flow

import LocationModel from '../LocationModel'

describe('LocationModel', () => {
  describe('location', () => {
    it('should return null if town, address and name is null', () => {
      expect(new LocationModel({
        name: null, country: null, region: null, state: null, address: null, town: null, postcode: null
      }).location).toBeNull()
    })

    it('should only return town (and postcode) if address is null', () => {
      expect(new LocationModel({
        name: null, country: null, region: null, state: null, address: null, town: 'Augsburg', postcode: '86161'
      }).location).toBe('86161 Augsburg')

      expect(new LocationModel({
        name: null, country: null, region: null, state: null, address: null, town: 'Augsburg', postcode: null
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
