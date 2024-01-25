import { MapFeature, MapFeatureCollection, LocationType, featureLayerId } from '../..'
import { PoiModelBuilder } from '../../api/endpoints/testing'
import PoiModel from '../../api/models/PoiModel'
import { embedInCollection, prepareFeatureLocation, prepareFeatureLocations, sortMapFeatures } from '../geoJson'

describe('geoJson', () => {
  const pois = new PoiModelBuilder(3).build()

  const poi1 = pois[0]!
  const poi2 = pois[1]!
  const poi3 = pois[2]!

  const longitude = 30
  const latitude = 30

  const userLocation: LocationType = [longitude, latitude]

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
      expect(embedInCollection([prepareFeatureLocation([poi1, poi3], 0, [30, 30])])).toEqual(
        expectedGeoJsonFeatureCollection,
      )
    })
  })

  describe('prepareFeatureLocation', () => {
    it('should prepare feature location with distance', () => {
      expect(prepareFeatureLocation([poi1, poi3], 0, [30, 30], userLocation)).toEqual({
        ...geoJsonMarkerFeature(0, poi1, poi3),
        properties: {
          pois: [
            { ...poi1.getFeature(userLocation), distance: '0.0' },
            { ...poi3.getFeature(userLocation), distance: '0.0' },
          ],
        },
      })
    })

    it('should prepare feature location without distance', () => {
      expect(prepareFeatureLocation([poi1, poi3], 0, [30, 30])).toEqual(geoJsonMarkerFeature(0, poi1, poi3))
    })
  })

  describe('prepareFeatureLocations', () => {
    it('should group close poiFeatures into single features', () => {
      expect(prepareFeatureLocations([poi1, poi2, poi3])).toEqual([
        geoJsonMarkerFeature(0, poi1, poi3),
        geoJsonMarkerFeature(1, poi2),
      ])
    })
  })

  describe('sortGeoJsonPois', () => {
    it('should sort features by distance ascending', () => {
      const features = prepareFeatureLocations([poi1, poi2, poi3], userLocation)
      const poiFeatures = features.flatMap(feature => feature.properties.pois)
      const poiFeature1 = poiFeatures[0]!
      const poiFeature2 = poiFeatures[2]!
      const poiFeature3 = poiFeatures[1]!

      expect(sortMapFeatures([poiFeature2, poiFeature1, poiFeature3])).toEqual([poiFeature1, poiFeature3, poiFeature2])
    })

    it('should sort features by name if no userlocation ascending', () => {
      const features = prepareFeatureLocations([poi1, poi2, poi3])
      const poiFeatures = features.flatMap(feature => feature.properties.pois)
      const poiFeature1 = poiFeatures[0]! // Test Title
      const poiFeature2 = poiFeatures[2]! // name 2
      const poiFeature3 = poiFeatures[1]! // another name
      expect(sortMapFeatures([poiFeature2, poiFeature1, poiFeature3])).toEqual([poiFeature3, poiFeature2, poiFeature1])
    })
  })
})
