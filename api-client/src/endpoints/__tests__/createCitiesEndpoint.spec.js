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
    tunews: true,
    push_notifications: true,
    name_without_prefix: 'Augsburg',
    prefix: null,
    longitude: 10.89779,
    latitude: 48.3705449,
    aliases: { Gersthofen: { longitude: 10.89779, latitude: 48.3705449 } }
  }
  const city2 = {
    name: 'Stadt Regensburg',
    path: '/regensburg/',
    live: true,
    events: false,
    extras: false,
    tunews: false,
    push_notifications: false,
    name_without_prefix: 'Regensburg',
    prefix: 'Stadt',
    longitude: null,
    latitude: null,
    aliases: null
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
        offersEnabled: true,
        pushNotificationsEnabled: true,
        tunewsEnabled: true,
        sortingName: 'Augsburg',
        prefix: null,
        longitude: 10.89779,
        latitude: 48.3705449,
        aliases: { Gersthofen: { longitude: 10.89779, latitude: 48.3705449 } }
      }),
      new CityModel({
        name: city2.name,
        code: 'regensburg',
        live: city2.live,
        eventsEnabled: false,
        offersEnabled: false,
        pushNotificationsEnabled: false,
        tunewsEnabled: false,
        sortingName: 'Regensburg',
        prefix: 'Stadt',
        latitude: null,
        longitude: null,
        aliases: null
      })
    ])
  })
})
