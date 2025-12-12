import { PoiModelBuilder } from '../../endpoints/testing'

describe('PoiModel', () => {
  const poi = new PoiModelBuilder(1).build()

  const expectedGeoJsonPoi = {
    id: 0,
    title: 'Test Title',
    symbol: 'gastronomy_#1DC6C6',
    slug: 'test',
  }

  const expectedOpeningHoursJson = [
    {
      _timeSlots: [{ end: '18:00', start: '08:00', timezone: 'Europe/Berlin' }],
      _allDay: true,
      _closed: false,
      _appointmentOnly: false,
    },
  ]

  it('should return geo location', () => {
    expect(poi[0]!.getFeature()).toEqual(expectedGeoJsonPoi)
  })

  it('should return openingHours', () => {
    expect(poi[0]!.openingHours).toEqual(expectedOpeningHoursJson)
  })
})
