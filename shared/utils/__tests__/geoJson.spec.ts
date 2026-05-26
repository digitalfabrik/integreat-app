import { MapFeature, MapFeatureCollection, featureLayerId } from '../../index.js'
import { PlaceModelBuilder } from '../../api/endpoints/testing/index.js'
import PlaceModel from '../../api/models/PlaceModel.js'
import { embedInCollection, prepareMapFeature, prepareMapFeatures } from '../geoJson.js'

describe('geoJson', () => {
  const places = new PlaceModelBuilder(3).build()

  const place1 = places[0]!
  const place2 = places[1]!
  const place3 = places[2]!

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
    it('should group close placeFeatures into single features', () => {
      expect(prepareMapFeatures([place1, place2, place3])).toEqual([
        geoJsonMarkerFeature(0, place1, place3),
        geoJsonMarkerFeature(1, place2),
      ])
    })
  })
})
