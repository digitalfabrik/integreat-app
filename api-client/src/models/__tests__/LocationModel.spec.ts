import LocationModel from '../LocationModel'

describe('LocationModel', () => {
  describe('location', () => {
    it('should return name if town, address and name is null', () => {
      expect(
        new LocationModel({
          id: 1,
          name: 'test',
          country: null,
          region: null,
          state: null,
          address: null,
          town: null,
          postcode: null
        }).location
      ).toBe('test')
    })
    it('should only return name, town (and postcode) if address is null', () => {
      expect(
        new LocationModel({
          id: 1,
          name: 'test',
          country: null,
          region: null,
          state: null,
          address: null,
          town: 'Augsburg',
          postcode: '86161'
        }).location
      ).toBe('test, 86161 Augsburg')
      expect(
        new LocationModel({
          id: 1,
          name: 'test',
          country: null,
          region: null,
          state: null,
          address: null,
          town: 'Augsburg',
          postcode: null
        }).location
      ).toBe('test, Augsburg')
    })
    it('should include the name if available', () => {
      const location = new LocationModel({
        id: 1,
        name: 'Café Tür an Tür',
        address: 'Wertachstr. 29',
        town: 'Augsburg',
        state: 'Bayern',
        postcode: '86353',
        region: 'Schwaben',
        country: 'DE'
      })
      expect(location.location).toBe('Café Tür an Tür, Wertachstr. 29, 86353 Augsburg')
    })
  })
  describe('get coordinates', () => {
    it('should return Position containing longitude and latitude', () => {
      const location = new LocationModel({
        id: 1,
        name: 'Test',
        address: 'Wertachstr. 29',
        town: 'Augsburg',
        state: 'Bayern',
        postcode: '86353',
        region: 'Schwaben',
        latitude: '33',
        longitude: '32',
        country: 'DE'
      })
      expect(location.coordinates).toEqual([Number(location.longitude), Number(location.latitude)])
    })
    it('should return null if longitude is null', () => {
      const location = new LocationModel({
        id: 1,
        name: 'Test',
        address: 'Wertachstr. 29',
        town: 'Augsburg',
        state: 'Bayern',
        postcode: '86353',
        region: 'Schwaben',
        latitude: '31.133859',
        longitude: null,
        country: 'DE'
      })
      expect(location.coordinates).toBeNull()
    })
    it('should return null if latitude is null', () => {
      const location = new LocationModel({
        id: 1,
        name: 'Test',
        address: 'Wertachstr. 29',
        town: 'Augsburg',
        state: 'Bayern',
        postcode: '86353',
        region: 'Schwaben',
        latitude: null,
        longitude: '31.133859',
        country: 'DE'
      })
      expect(location.coordinates).toBeNull()
    })
  })
})
