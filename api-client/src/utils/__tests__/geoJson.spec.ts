import { PoiFeature, PoiFeatureCollection, LocationType } from '../../maps'
import { PoiModelBuilder } from '../../testing'
import { embedInCollection, prepareFeatureLocation, prepareFeatureLocations } from '../geoJson'

describe('geoJson', () => {
  const pois = new PoiModelBuilder(3).build()

  const poi1 = pois[0]!
  const poi2 = pois[1]!
  const poi3 = pois[2]!

  const longitude = 31.133859
  const latitude = 29.979848

  const expectedGeoJsonMarkerFeature: PoiFeature = {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [longitude, latitude],
    },
    properties: {
      id: 0,
      title: 'Test Title',
      symbol: 'marker_40',
      thumbnail: 'test',
      path: '/augsburg/de/locations/test',
      slug: 'test',
      address: 'Test Address 1',
      closeToOtherPoi: false,
    },
  }

  const userLocation: LocationType = [longitude, latitude]

  describe('embedInCollection', () => {
    const expectedGeoJsonFeatureCollection: PoiFeatureCollection = {
      features: [expectedGeoJsonMarkerFeature],
      type: 'FeatureCollection',
    }

    it('should embed feature to GeoJson', () => {
      expect(embedInCollection([poi1.featureLocation!])).toEqual(expectedGeoJsonFeatureCollection)
    })
  })

  describe('prepareFeatureLocation', () => {
    it('should prepare feature location with distance', () => {
      expect(prepareFeatureLocation(poi1, userLocation, [])).toEqual({
        ...expectedGeoJsonMarkerFeature,
        properties: {
          ...expectedGeoJsonMarkerFeature.properties,
          distance: '0.0',
        },
      })
    })

    it('should prepare feature location without distance', () => {
      expect(prepareFeatureLocation(poi1, null, [])).toEqual(expectedGeoJsonMarkerFeature)
    })

    it('should mark feature location as having identical other locations', () => {
      const coordinateList = [
        [longitude, latitude],
        [longitude, latitude],
      ]
      expect(prepareFeatureLocation(poi1, null, coordinateList)).toEqual({
        ...expectedGeoJsonMarkerFeature,
        properties: {
          ...expectedGeoJsonMarkerFeature.properties,
          closeToOtherPoi: true,
        },
      })
    })

    it('should mark feature location as having close other locations', () => {
      const coordinateList = [
        [longitude, latitude],
        [longitude + 0.0001, latitude - 0.0001],
      ]
      expect(prepareFeatureLocation(poi1, null, coordinateList)).toEqual({
        ...expectedGeoJsonMarkerFeature,
        properties: {
          ...expectedGeoJsonMarkerFeature.properties,
          closeToOtherPoi: true,
        },
      })
    })

    it('should mark feature location as not having close other locations', () => {
      const coordinateList = [[longitude, latitude]]
      expect(prepareFeatureLocation(poi1, null, coordinateList)).toEqual(expectedGeoJsonMarkerFeature)
    })
  })

  describe('prepareFeatureLocations', () => {
    it('should sort feature location by distance ascending', () => {
      const poiFeature1 = prepareFeatureLocation(poi1, userLocation, [])
      const poiFeature2 = prepareFeatureLocation(poi2, userLocation, [])
      const poiFeature3 = prepareFeatureLocation(poi3, userLocation, [])
      expect(prepareFeatureLocations([poi3, poi2, poi1], userLocation)).toEqual([poiFeature1, poiFeature3, poiFeature2])
    })

    it('should sort features by name if no userLoaction is supplied', () => {
      const poiFeature1 = prepareFeatureLocation(poi1, null, []) // Test Title
      const poiFeature2 = prepareFeatureLocation(poi2, null, []) // name 2
      const poiFeature3 = prepareFeatureLocation(poi3, null, []) // another name
      expect(prepareFeatureLocations([poi1, poi2, poi3], null)).toEqual([poiFeature3, poiFeature2, poiFeature1])
    })
  })
})
