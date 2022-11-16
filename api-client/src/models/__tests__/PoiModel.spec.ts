import { PoiModelBuilder } from '../../testing'

describe('PoiModel', () => {
  const poi = new PoiModelBuilder(1).build()[0]!

  const expectedGeoJsonMarkerFeature = {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [31.133859, 29.979848],
    },
    properties: {
      id: 0,
      title: 'Test Title',
      symbol: 'marker_40',
      thumbnail: 'test',
      path: '/augsburg/de/locations/test',
      urlSlug: 'test',
      address: 'Test Address 1',
      closeToOtherPoi: false,
    },
  }

  it('should return geo location', () => {
    expect(poi.featureLocation).toEqual(expectedGeoJsonMarkerFeature)
  })
})
