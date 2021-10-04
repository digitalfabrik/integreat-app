import { Feature } from 'geojson'

import LocationModel from '../LocationModel'

describe('LocationModel', () => {
  describe('location', () => {
    it('should return null if town, address and name is null', () => {
      expect(
        new LocationModel({
          id: null,
          name: null,
          country: null,
          region: null,
          state: null,
          address: null,
          town: null,
          postcode: null
        }).location
      ).toBeNull()
    })
    it('should only return town (and postcode) if address is null', () => {
      expect(
        new LocationModel({
          id: null,
          name: null,
          country: null,
          region: null,
          state: null,
          address: null,
          town: 'Augsburg',
          postcode: '86161'
        }).location
      ).toBe('86161 Augsburg')
      expect(
        new LocationModel({
          id: null,
          name: null,
          country: null,
          region: null,
          state: null,
          address: null,
          town: 'Augsburg',
          postcode: null
        }).location
      ).toBe('Augsburg')
    })
    it('should include the name if available', () => {
      const location = new LocationModel({
        id: null,
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
        id: null,
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
describe('convertToPoint', () => {
  const thumbnail = 'thumbnail'
  const path = '/augsburg/de/locations/erster_poi'
  const expectedGeoJsonMarkerFeature: Feature = {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [31.133859, 29.979848]
    },
    properties: {
      id: 1,
      title: 'Test',
      symbol: '9',
      thumbnail: 'thumbnail',
      path: '/augsburg/de/locations/erster_poi'
    }
  }
  it('should be transformed to GeoJson type', () => {
    const location = new LocationModel({
      id: 1,
      name: 'Test',
      address: 'Wertachstr. 29',
      town: 'Augsburg',
      state: 'Bayern',
      postcode: '86353',
      region: 'Schwaben',
      latitude: '29.979848',
      longitude: '31.133859',
      country: 'DE'
    })
    expect(location.convertToPoint(path, thumbnail)).toEqual(expectedGeoJsonMarkerFeature)
  })
  it('should return null when latitude is null ', () => {
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
    expect(location.convertToPoint(path, thumbnail)).toBeNull()
  })
  it('should return null when longitude is null ', () => {
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
    expect(location.convertToPoint(path, thumbnail)).toBeNull()
  })
})
