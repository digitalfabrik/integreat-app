import moment from 'moment'

import LocationModel from '../LocationModel'
import PoiModel from '../PoiModel'

describe('PoiModel', () => {
  const availableLanguages = new Map([
    ['de', '/de/test'],
    ['en', '/en/test']
  ])
  const createPoi = ({
    longitude = '31.133859',
    latitude = '29.979848'
  }: {
    longitude?: string | null
    latitude?: string | null
  }) =>
    new PoiModel({
      path: '/augsburg/de/locations/erster_poi',
      title: 'Test',
      content: 'test',
      thumbnail: 'thumbnail',
      availableLanguages,
      excerpt: 'test',
      website: null,
      phoneNumber: null,
      email: null,
      location: new LocationModel({
        id: 1,
        country: 'country',
        address: 'Wertachstr. 29',
        town: 'town',
        postcode: 'postcode',
        latitude,
        longitude,
        name: 'name'
      }),
      lastUpdate: moment('2011-02-04T00:00:00.000Z'),
      hash: 'test'
    })

  const expectedGeoJsonMarkerFeature = {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [31.133859, 29.979848]
    },
    properties: {
      id: 1,
      title: 'name',
      symbol: 'marker_15',
      thumbnail: 'thumbnail',
      path: '/augsburg/de/locations/erster_poi',
      urlSlug: 'erster_poi',
      address: 'Wertachstr. 29'
    }
  }

  describe('featureLocation', () => {
    it('should be transformed to GeoJson type', () => {
      const poi = createPoi({})
      expect(poi.featureLocation).toEqual(expectedGeoJsonMarkerFeature)
    })

    it('should return null when latitude is null', () => {
      const poi = createPoi({ latitude: null })
      expect(poi.featureLocation).toBeNull()
    })

    it('should return null when longitude is null', () => {
      const poi = createPoi({ longitude: null })
      expect(poi.featureLocation).toBeNull()
    })
  })
})
