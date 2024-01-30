import { PoiModelBuilder } from '../../api/endpoints/testing'
import LocationModel from '../../api/models/LocationModel'
import getExternalMapsLink from '../getExternalMapsLink'

describe('getExternalMapsLink', () => {
  const location: LocationModel<number> = new PoiModelBuilder(1).build()[0]!.location
  const long = location.coordinates[0]
  const lat = location.coordinates[1]

  it('should return android for android app', () => {
    const result = getExternalMapsLink(location, 'android')
    expect(result).toBe(`geo:${lat},${long}?q=${location.fullAddress}`)
  })

  it('should return ios for ios app', () => {
    const result = getExternalMapsLink(location, 'ios')
    expect(result).toBe(`maps:${lat},${long}?q=${location.fullAddress}`)
  })

  it('should return web for ios web', () => {
    const result = getExternalMapsLink(location, 'web')
    expect(result).toBe(`https://maps.google.com?q=${location.fullAddress},${lat},${long}`)
  })

  it('should throw for unsupported platforms', () => {
    expect(() => getExternalMapsLink(location, 'unsupported')).toThrow(
      new Error('Platform unsupported is not supported!'),
    )
  })
})
