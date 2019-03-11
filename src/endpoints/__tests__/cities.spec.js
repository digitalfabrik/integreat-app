// @flow

import cities from '../cities'
import CityModel from '../../models/CityModel'

jest.unmock('../cities')

describe('cities', () => {
  const apiUrl = 'https://integreat-api-url.de'

  const city1 = {
    name: 'Augsburg',
    path: '/augsburg/',
    live: true,
    events: true,
    extras: true,
    name_without_prefix: 'Augsburg'
  }
  const city2 = {
    name: 'Stadt Regensburg',
    path: '/regensburg/',
    live: true,
    events: false,
    extras: false,
    name_without_prefix: 'Regensburg'
  }
  const cityJson = [city1, city2]

  it('should map params to url', () => {
    expect(cities.mapParamsToUrl(apiUrl)).toEqual('https://integreat-api-url.de/wp-json/extensions/v3/sites')
  })

  it('should map fetched data to models', () => {
    const cityModels = cities.mapResponse(cityJson)
    expect(cityModels).toEqual([
      new CityModel({
        name: city1.name,
        code: 'augsburg',
        live: city1.live,
        eventsEnabled: true,
        extrasEnabled: true,
        sortingName: 'Augsburg'
      }),
      new CityModel({
        name: city2.name,
        code: 'regensburg',
        live: city2.live,
        eventsEnabled: false,
        extrasEnabled: false,
        sortingName: 'Regensburg'
      })
    ])
  })
})
