import { PoiFeature, PoiFeatureCollection, LocationType } from '../../maps'
import PoiModel from '../../models/PoiModel'
import { PoiModelBuilder } from '../../testing'
import { embedInCollection, prepareFeatureLocation, prepareFeatureLocations, sortPoiFeatures } from '../geoJson'

describe('geoJson', () => {
  const pois = new PoiModelBuilder(3).build()

  const poi1 = pois[0]!
  const poi2 = pois[1]!
  const poi3 = pois[2]!

  const longitude = 30
  const latitude = 30

  const userLocation: LocationType = [longitude, latitude]

  const geoJsonMarkerFeature = (id: number, ...pois: PoiModel[]): PoiFeature => ({
    type: 'Feature',
    id: id.toString(),
    geometry: {
      type: 'Point',
      coordinates: pois[0]!.location.coordinates,
    },
    properties: {
      pois: pois.map(poi => poi.getFeature()),
    },
  })


  describe('embedInCollection', () => {
    const expectedGeoJsonFeatureCollection: PoiFeatureCollection = {
      features: [geoJsonMarkerFeature(0, poi1, poi3)],
      type: 'FeatureCollection',
    }

    it('should embed feature to GeoJson', () => {
      expect(embedInCollection([prepareFeatureLocation([poi1, poi3], 0, [30, 30])])).toEqual(
        expectedGeoJsonFeatureCollection
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
    it('should sort feature location by distance ascending', () => {
      const poiFeature1 = prepareFeatureLocation([poi1], 1, poi1.location.coordinates, userLocation)
      const poiFeature2 = prepareFeatureLocation([poi2], 0, poi2.location.coordinates, userLocation)
      expect(prepareFeatureLocations([poi2, poi1], userLocation)).toEqual([poiFeature1, poiFeature2])
    })

    it('should group close poiFeatures into single features', () => {
      expect(prepareFeatureLocations([poi1, poi2, poi3])).toEqual([
        geoJsonMarkerFeature(0, poi1, poi3),
        geoJsonMarkerFeature(1, poi2),
      ])
    })
  })

  describe('sortPoiFeatures', () => {
    it('should sort features by distance ascending', () => {
      const features = prepareFeatureLocations([poi1, poi2, poi3], userLocation)
      const poiFeatures = features.flatMap(feature => feature.properties.pois)
      const poiFeature1 = poiFeatures[0]!
      const poiFeature2 = poiFeatures[2]!
      const poiFeature3 = poiFeatures[1]!

      expect(sortPoiFeatures([poiFeature2, poiFeature1, poiFeature3])).toEqual([poiFeature1, poiFeature3, poiFeature2])
    })

    it('should sort features by name if no userlocation ascending', () => {
      const features = prepareFeatureLocations([poi1, poi2, poi3])
      const poiFeatures = features.flatMap(feature => feature.properties.pois)
      const poiFeature1 = poiFeatures[0]! // Test Title
      const poiFeature2 = poiFeatures[2]! // name 2
      const poiFeature3 = poiFeatures[1]! // another name
      expect(sortPoiFeatures([poiFeature2, poiFeature1, poiFeature3])).toEqual([poiFeature3, poiFeature2, poiFeature1])
    })
  })
})
