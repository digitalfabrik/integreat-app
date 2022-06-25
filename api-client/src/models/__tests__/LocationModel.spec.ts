import LocationModel from '../LocationModel'

describe('LocationModel', () => {
  it('should return full address', () => {
    const location = new LocationModel({
      id: 1,
      name: 'Café Tür an Tür',
      address: 'Wertachstr. 29',
      town: 'Augsburg',
      postcode: '86353',
      country: 'DE',
      latitude: null,
      longitude: null
    })
    expect(location.fullAddress).toBe('Café Tür an Tür, Wertachstr. 29, 86353 Augsburg')
  })

  describe('coordinates', () => {
    it('should return Position containing longitude and latitude', () => {
      const location = new LocationModel({
        id: 1,
        name: 'Test',
        address: 'Wertachstr. 29',
        town: 'Augsburg',
        postcode: '86353',
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
        postcode: '86353',
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
        postcode: '86353',
        latitude: null,
        longitude: '31.133859',
        country: 'DE'
      })
      expect(location.coordinates).toBeNull()
    })
  })
})
