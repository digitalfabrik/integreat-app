import LocationModel from '../../models/LocationModel'
import { PoiModelBuilder } from '../../testing'
import getExternalMapsLink from '../getExternalMapsLink'

describe('getExternalMapsLink', () => {
  const location: LocationModel = new PoiModelBuilder(1).build()[0]!.location
  const long = location.coordinates![0]
  const lat = location.coordinates![1]

  it('should return android for android app', () => {
    const result = getExternalMapsLink(location, 'android')
    expect(result).toBe(`geo:${lat},${long}?q=${location.location}`)
  })

  it('should return ios for ios app', () => {
    const result = getExternalMapsLink(location, 'ios')
    expect(result).toBe(`maps:${lat},${long}?q=${location.location}`)
  })
})
