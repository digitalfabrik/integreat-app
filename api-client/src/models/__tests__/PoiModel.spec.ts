import { PoiModelBuilder } from '../../testing'

describe('PoiModel', () => {
  const poi = new PoiModelBuilder(1).build()

  const expectedGeoJsonMarkerFeature = {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [31.133859, 29.979848],
    },
    properties: {
      id: 0,
      title: 'Test Title',
      category: 'Gastronomie',
      symbol: 'gastronomy_#1DC6C6',
      thumbnail: 'test',
      path: '/augsburg/de/locations/test',
      slug: 'test',
      address: 'Test Address 1',
      closeToOtherPoi: false,
    },
  }

  const expectedOpeningHoursJson = [
    {
      _timeSlots: [{ end: '18:00', start: '08:00' }],
      _allDay: true,
      _closed: false,
    },
  ]

  it('should return geo location', () => {
    expect(poi[0]!.featureLocation).toEqual(expectedGeoJsonMarkerFeature)
  })

  it('should return openingHours', () => {
    expect(poi[0]!.openingHours).toEqual(expectedOpeningHoursJson)
  })
})
