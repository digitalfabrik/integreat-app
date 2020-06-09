// @flow

import { CityModel } from '@integreat-app/integreat-api-client'

const cities = [
  new CityModel({
    name: 'Stadt Augsburg',
    code: 'augsburg',
    live: true,
    eventsEnabled: true,
    extrasEnabled: true,
    pushNotificationsEnabled: false,
    tunewsEnabled: false,
    sortingName: 'Augsburg',
    prefix: 'Stadt',
    pushNotificationsEnabled: true,
    tunewsEnabled: false,
    latitude: 48.369696,
    longitude: 10.892578,
    aliases: {
      Konigsbrunn: {
        latitude: 48.267499,
        longitude: 10.889586
      }
    }
  }),
  new CityModel({
    name: 'Oldtown',
    code: 'oldtown',
    live: false,
    eventsEnabled: true,
    extrasEnabled: true,
    pushNotificationsEnabled: false,
    tunewsEnabled: false,
    sortingName: 'Oldtown',
    prefix: 'GoT',
    tunewsEnabled: true,
    pushNotificationsEnabled: true,
    latitude: null,
    longitude: null,
    aliases: null
  })
]

class CityModelBuilder {
  _citiesCount: number

  constructor (citiesCount: number) {
    if (this._citiesCount > cities.length) {
      throw new Error(`Only ${cities.length} city models can be created`)
    }
    this._citiesCount = citiesCount
  }

  build (): Array<CityModel> {
    return cities.slice(0, this._citiesCount)
  }
}

export default CityModelBuilder
