/* eslint-disable @typescript-eslint/no-non-null-assertion */
import LocationModel from '../../models/LocationModel'
import { Feature, FeatureCollection } from 'geojson'
import { embedInCollection } from '../geoJson_1'

describe('geoJson', () => {
  const expectedGeoJsonMarkerFeature: Feature = {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [31.133859, 29.979848]
    },
    properties: {
      name: 'Test'
    }
  }
  describe('embedInCollection', () => {
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
      expect(embedInCollection([location.convertToPoint()!])).toEqual(expectedGeoJsonFeatureCollection)
    })
  })
})
