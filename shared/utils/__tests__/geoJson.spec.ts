import { MapFeature, MapFeatureCollection, featureLayerId } from '../..'
import { PoiModelBuilder } from '../../api/endpoints/testing'
import PoiModel from '../../api/models/PoiModel'
import { embedInCollection, prepareMapFeature, prepareMapFeatures } from '../geoJson'

describe('geoJson', () => {
  const pois = new PoiModelBuilder(3).build()

  const poi1 = pois[0]!
  const poi2 = pois[1]!
  const poi3 = pois[2]!

  const geoJsonMarkerFeature = (id: number, ...pois: PoiModel[]): MapFeature => ({
    type: 'Feature',
    id: id.toString(),
    geometry: {
      type: 'Point',
      coordinates: pois[0]!.location.coordinates,
    },
    properties: {
      pois: pois.map(poi => poi.getFeature()),
    },
    layer: {
      id: featureLayerId,
    },
  })

  describe('embedInCollection', () => {
    const expectedGeoJsonFeatureCollection: MapFeatureCollection = {
      features: [geoJsonMarkerFeature(0, poi1, poi3)],
      type: 'FeatureCollection',
    }

    it('should embed feature to GeoJson', () => {
      expect(embedInCollection([prepareMapFeature([poi1, poi3], 0, [30, 30])])).toEqual(
        expectedGeoJsonFeatureCollection,
      )
    })
  })

  it('should prepare feature locations', () => {
    expect(prepareMapFeature([poi1, poi3], 0, [30, 30])).toEqual(geoJsonMarkerFeature(0, poi1, poi3))
  })

  describe('prepareFeatureLocations', () => {
    it('should group close poiFeatures into single features', () => {
      expect(prepareMapFeatures([poi1, poi2, poi3])).toEqual([
        geoJsonMarkerFeature(0, poi1, poi3),
        geoJsonMarkerFeature(1, poi2),
      ])
    })
  })
})
