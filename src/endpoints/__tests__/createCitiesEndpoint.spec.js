// @flow

import createCitiesEndpoint from '../createCitiesEndpoint'
import CityModel from '../../models/CityModel'

describe('cities', () => {
  const baseUrl = 'https://integreat-api-url.de'
  const cities = createCitiesEndpoint(baseUrl)

  const city1 = {
    name: 'Augsburg',
    path: '/augsburg/',
    live: true,
    events: true,
    extras: true,
    name_without_prefix: 'Augsburg',
    prefix: null
  }
  const city2 = {
    name: 'Stadt Regensburg',
    path: '/regensburg/',
    live: true,
    events: false,
    extras: false,
    name_without_prefix: 'Regensburg',
    prefix: 'Stadt'
  }
  const cityJson = [city1, city2]

  it('should map params to url', () => {
    expect(cities.mapParamsToUrl()).toEqual('https://integreat-api-url.de/wp-json/extensions/v3/sites')
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
        sortingName: 'Augsburg',
        prefix: null
      }),
      new CityModel({
        name: city2.name,
        code: 'regensburg',
        live: city2.live,
        eventsEnabled: false,
        extrasEnabled: false,
        sortingName: 'Regensburg',
        prefix: 'Stadt'
      })
    ])
  })
})
