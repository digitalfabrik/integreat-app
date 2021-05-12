import CityModel from '../models/CityModel'

const cities = [
  new CityModel({
    name: 'Stadt Augsburg',
    code: 'augsburg',
    live: true,
    eventsEnabled: true,
    offersEnabled: true,
    poisEnabled: true,
    pushNotificationsEnabled: false,
    tunewsEnabled: false,
    sortingName: 'Augsburg',
    prefix: 'Stadt',
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
    offersEnabled: true,
    poisEnabled: false,
    pushNotificationsEnabled: false,
    tunewsEnabled: false,
    sortingName: 'Oldtown',
    prefix: 'GoT',
    latitude: null,
    longitude: null,
    aliases: null
  }),
  new CityModel({
    name: 'City',
    code: 'city',
    live: true,
    eventsEnabled: false,
    offersEnabled: false,
    poisEnabled: true,
    pushNotificationsEnabled: false,
    tunewsEnabled: false,
    sortingName: 'City',
    latitude: null,
    longitude: null,
    prefix: null,
    aliases: null
  }),
  new CityModel({
    name: 'Other city',
    code: 'otherCity',
    live: true,
    eventsEnabled: false,
    offersEnabled: false,
    poisEnabled: false,
    pushNotificationsEnabled: false,
    tunewsEnabled: false,
    sortingName: 'OtherCity',
    latitude: null,
    longitude: null,
    prefix: null,
    aliases: null
  }),
  new CityModel({
    name: 'Notlive',
    code: 'nonlive',
    live: false,
    eventsEnabled: false,
    offersEnabled: false,
    poisEnabled: true,
    pushNotificationsEnabled: false,
    tunewsEnabled: false,
    sortingName: 'Nonlive',
    latitude: null,
    longitude: null,
    prefix: null,
    aliases: null
  }),
  new CityModel({
    name: 'Yet another city',
    code: 'yetanothercity',
    live: true,
    eventsEnabled: false,
    offersEnabled: false,
    poisEnabled: false,
    pushNotificationsEnabled: false,
    tunewsEnabled: false,
    sortingName: 'Yetanothercity',
    latitude: null,
    longitude: null,
    prefix: null,
    aliases: null
  })
]

class CityModelBuilder {
  _citiesCount: number

  constructor(citiesCount: number) {
    this._citiesCount = citiesCount
    if (this._citiesCount > cities.length) {
      throw new Error(`Only ${cities.length} city models can be created`)
    }
  }

  build(): Array<CityModel> {
    return cities.slice(0, this._citiesCount)
  }
}

export default CityModelBuilder
