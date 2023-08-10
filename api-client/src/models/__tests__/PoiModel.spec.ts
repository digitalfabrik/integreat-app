import { PoiModelBuilder } from '../../testing'

describe('PoiModel', () => {
  const poi = new PoiModelBuilder(1).build()

  const expectedGeoJsonPoiFeature = {
    id: 0,
    title: 'Test Title',
    category: 'Gastronomie',
    symbol: 'gastronomy_#1DC6C6',
    thumbnail: 'test',
    path: '/augsburg/de/locations/test',
    slug: 'test',
    address: 'Test Address 1',
  }

  const expectedOpeningHoursJson = [
    {
      _timeSlots: [{ end: '18:00', start: '08:00' }],
      _allDay: true,
      _closed: false,
    },
  ]

  it('should return geo location', () => {
    expect(poi[0]!.getFeature()).toEqual(expectedGeoJsonPoiFeature)
  })

  it('should return geo location with distance', () => {
    expect(poi[0]!.getFeature(poi[0]!.location.coordinates)).toEqual({ ...expectedGeoJsonPoiFeature, distance: '0.0' })
  })

  it('should return openingHours', () => {
    expect(poi[0]!.openingHours).toEqual(expectedOpeningHoursJson)
  })
})
