import { PoiFeature } from '../../maps'
import LocationModel from '../LocationModel'

describe('LocationModel', () => {
  const thumbnail = 'thumbnail'
  const path = '/augsburg/de/locations/erster_poi'
  const urlSlug = 'erster_poi'
  const expectedGeoJsonMarkerFeature: PoiFeature = {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [31.133859, 29.979848]
    },
    properties: {
      id: 1,
      title: 'Test',
      symbol: 'marker_15',
      thumbnail: 'thumbnail',
      path: '/augsburg/de/locations/erster_poi',
      urlSlug,
      address: 'Wertachstr. 29'
    }
  }
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
      expect(location.convertToPoint(path, thumbnail, urlSlug)).toEqual(expectedGeoJsonMarkerFeature)
    })
    it('should return null when latitude is null', () => {
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
      expect(location.convertToPoint(path, thumbnail, urlSlug)).toBeNull()
    })
    it('should return null when longitude is null', () => {
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
      expect(location.convertToPoint(path, thumbnail, urlSlug)).toBeNull()
    })
  })

  describe('convertToPoint', () => {
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
      expect(location.convertToPoint(path, thumbnail, urlSlug)).toEqual(expectedGeoJsonMarkerFeature)
    })
    it('should return null when latitude is null', () => {
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
      expect(location.convertToPoint(path, thumbnail, urlSlug)).toBeNull()
    })
    it('should return null when longitude is null', () => {
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
      expect(location.convertToPoint(path, thumbnail, urlSlug)).toBeNull()
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
