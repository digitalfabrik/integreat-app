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
      title: 'name',
      symbol: 'marker_15',
      thumbnail: 'test',
      path: 'test',
      urlSlug: 'test',
      address: 'address'
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
