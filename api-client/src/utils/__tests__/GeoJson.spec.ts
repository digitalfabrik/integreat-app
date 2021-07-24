import LocationModel from '../../models/LocationModel'
import { convertToPoint, embedInCollection } from '../GeoJson'
import { Feature, FeatureCollection } from 'geojson'

describe('GeoHelper Methods', () => {
  const expectedGeoJsonMarkerFeature: Feature = {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [29.979848, 31.133859]
    },
    properties: {
      name: 'Test'
    }
  }
  describe('ConvertToPoint', () => {
    it('should be transformed to GeoJson type', () => {
      const location = new LocationModel({
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
      expect(convertToPoint(location)).toEqual(expectedGeoJsonMarkerFeature)
    })
  })
  describe('EmbedInCollection', () => {
    const expectedGeoJsonFeatureCollection: FeatureCollection = {
      features: [expectedGeoJsonMarkerFeature],
      type: 'FeatureCollection'
    }
    it('should embed feature to GeoJson', () => {
      const location = new LocationModel({
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
      expect(embedInCollection([convertToPoint(location)])).toEqual(expectedGeoJsonFeatureCollection)
    })
  })
})
