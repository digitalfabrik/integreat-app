/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { PoiFeature, PoiFeatureCollection } from '../../maps'
import LocationModel from '../../models/LocationModel'
import { embedInCollection } from '../geoJson'

describe('geoJson', () => {
  const path = '/augsburg/de/locations/erster_poi'
  const thumbnail = 'thumbnail'
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
      symbol: '9',
      thumbnail,
      path,
      urlSlug
    }
  }
  describe('embedInCollection', () => {
    const expectedGeoJsonFeatureCollection: PoiFeatureCollection = {
      features: [expectedGeoJsonMarkerFeature],
      type: 'FeatureCollection'
    }
    it('should embed feature to GeoJson', () => {
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
      expect(embedInCollection([location.convertToPoint(path, thumbnail, urlSlug)!])).toEqual(
        expectedGeoJsonFeatureCollection
      )
    })
  })
})
