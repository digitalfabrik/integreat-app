import { PlaceModelBuilder } from '../../api/endpoints/testing/index.ts'
import PlaceModel from '../../api/models/PlaceModel.ts'
import { MapFeature, MapFeatureCollection, featureLayerId } from '../../index.ts'
import { embedInCollection, prepareMapFeature, prepareMapFeatures } from '../geoJson.ts'

describe('geoJson', () => {
  const places = new PlaceModelBuilder(4).build()

  const place1 = places[0]!
  const place2 = places[1]!
  const place3 = places[2]!
  const place4 = places[3]!

  const geoJsonMarkerFeature = (id: number, ...places: PlaceModel[]): MapFeature => ({
    type: 'Feature',
    id,
    geometry: {
      type: 'Point',
      coordinates: places[0]!.location.coordinates,
    },
    properties: {
      places: places.map(place => place.getFeature()),
    },
    layer: {
      id: featureLayerId,
    },
  })

  describe('embedInCollection', () => {
    const expectedGeoJsonFeatureCollection: MapFeatureCollection = {
      features: [geoJsonMarkerFeature(0, place1, place3)],
      type: 'FeatureCollection',
    }

    it('should embed feature to GeoJson', () => {
      expect(embedInCollection([prepareMapFeature([place1, place3], 0, [30, 30])])).toEqual(
        expectedGeoJsonFeatureCollection,
      )
    })
  })

  it('should prepare map features', () => {
    expect(prepareMapFeature([place1, place3], 0, [30, 30])).toEqual(geoJsonMarkerFeature(0, place1, place3))
  })

  describe('prepareMapFeatures', () => {
    it('should group places with exactly the same coordinates into one feature', () => {
      expect(prepareMapFeatures([place1, place2, place4])).toEqual([
        geoJsonMarkerFeature(0, place1, place4),
        geoJsonMarkerFeature(1, place2),
      ])
    })

    it('should not group places that are close but not at the same coordinates', () => {
      expect(prepareMapFeatures([place1, place2, place3])).toEqual([
        geoJsonMarkerFeature(0, place1),
        geoJsonMarkerFeature(1, place2),
        geoJsonMarkerFeature(2, place3),
      ])
    })
  })
})
