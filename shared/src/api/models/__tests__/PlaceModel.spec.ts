import { PlaceModelBuilder } from '../../endpoints/testing/index.ts'

describe('PlaceModel', () => {
  const place = new PlaceModelBuilder(1).build()

  const expectedGeoJsonPlace = {
    id: 0,
    title: 'Test Title',
    symbol: 'gastronomy_#1DC6C6',
    slug: 'test',
  }

  const expectedOpeningHoursJson = [
    {
      _timeSlots: [{ end: '18:00', start: '08:00', timezone: 'Europe/Berlin' }],
      _openAllDay: true,
      _closedAllDay: false,
      _appointmentOnly: false,
    },
  ]

  it('should return geo location', () => {
    expect(place[0]!.getFeature()).toEqual(expectedGeoJsonPlace)
  })

  it('should return openingHours', () => {
    expect(place[0]!.openingHours).toEqual(expectedOpeningHoursJson)
  })
})
