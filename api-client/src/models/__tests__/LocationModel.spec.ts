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

  it('should return coordinates', () => {
    const location = new LocationModel({
      id: 1,
      name: 'Test',
      address: 'Wertachstr. 29',
      town: 'Augsburg',
      postcode: '86353',
      latitude: 33,
      longitude: 32,
      country: 'DE'
    })
    expect(location.coordinates).toEqual([location.longitude, location.latitude])
  })
})
