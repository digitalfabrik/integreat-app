import CityModel from '../../models/CityModel'
import getNearbyCities from '../getNearbyCities'

describe('getNearbyCities', () => {
  const createCity = (
    longitude: number,
    latitude: number,
    aliases: { [name: string]: { longitude: number; latitude: number } } | null
  ) =>
    new CityModel({
      name: 'Stadt Augsburg',
      code: 'augsburg',
      live: true,
      eventsEnabled: true,
      offersEnabled: true,
      poisEnabled: true,
      localNewsEnabled: false,
      tunewsEnabled: false,
      sortingName: 'Augsburg',
      prefix: 'Stadt',
      longitude,
      latitude,
      aliases,
      boundingBox: [10.7880103, 48.447238, 11.0174493, 48.297834]
    })

  const longitude = 10.892578
  const latitude = 48.369696

  const exactCity = createCity(longitude, latitude, null)
  const closeAliasCity = createCity(0, 0, { alias: { longitude: longitude - 0.005, latitude } })
  const closeCity = createCity(longitude - 0.01, latitude, null)
  const stillCloseCity = createCity(longitude - 0.02, latitude, null)
  const outsideThresholdCity1 = createCity(12.097392, 49.017834, null)
  const outsideThresholdCity2 = createCity(0, 0, null)

  it('should return first nearby cities sorted by distance', () => {
    const cities = [closeCity, exactCity, outsideThresholdCity1, stillCloseCity, closeAliasCity, outsideThresholdCity2]
    expect(getNearbyCities([longitude, latitude], cities)).toEqual([exactCity, closeAliasCity, closeCity])
  })

  it('should not return cities outside of distance threshold', () => {
    const cities = [outsideThresholdCity1, stillCloseCity, closeAliasCity, outsideThresholdCity2]
    expect(getNearbyCities([longitude, latitude], cities)).toEqual([closeAliasCity, stillCloseCity])
  })
})
