import { PoiFeature, PoiFeatureCollection } from '../../maps'
import { PoiModelBuilder } from '../../testing'
import { embedInCollection } from '../geoJson'

describe('geoJson', () => {
  const poi = new PoiModelBuilder(1).build()[0]!

  const expectedGeoJsonMarkerFeature: PoiFeature = {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [31.133859, 29.979848]
    },
    properties: {
      id: 1,
      title: 'Test Title',
      symbol: 'marker_15',
      thumbnail: 'test',
      path: '/augsburg/de/locations/test',
      urlSlug: 'test',
      address: 'Test Address 1'
    }
  }
  describe('embedInCollection', () => {
    const expectedGeoJsonFeatureCollection: PoiFeatureCollection = {
      features: [expectedGeoJsonMarkerFeature],
      type: 'FeatureCollection'
    }

    it('should embed feature to GeoJson', () => {
      expect(embedInCollection([poi.featureLocation!])).toEqual(expectedGeoJsonFeatureCollection)
    })
  })
})
