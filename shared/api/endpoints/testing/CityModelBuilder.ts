import CityModel from '../../models/CityModel'
import LanguageModelBuilder from './LanguageModelBuilder'

const languages = new LanguageModelBuilder(3).build()

const cities = [
  new CityModel({
    name: 'Stadt Augsburg',
    code: 'augsburg',
    live: true,
    languages,
    eventsEnabled: true,
    offersEnabled: true,
    poisEnabled: true,
    localNewsEnabled: true,
    tunewsEnabled: true,
    sortingName: 'Augsburg',
    prefix: 'Stadt',
    latitude: 48.369696,
    longitude: 10.892578,
    aliases: {
      Konigsbrunn: {
        latitude: 48.267499,
        longitude: 10.889586,
      },
    },
    boundingBox: [10.7880103, 48.447238, 11.0174493, 48.297834],
  }),
  new CityModel({
    name: 'Oldtown',
    code: 'oldtown',
    live: false,
    languages,
    eventsEnabled: true,
    offersEnabled: false,
    poisEnabled: false,
    localNewsEnabled: false,
    tunewsEnabled: false,
    sortingName: 'Oldtown',
    prefix: 'GoT',
    latitude: 49.017834,
    longitude: 12.097392,
    aliases: {
      Konigsbrunn: {
        latitude: 48.28,
        longitude: 10.8,
      },
    },
    boundingBox: [12.002, 48.947, 11.0174493, 49.297834],
  }),
  new CityModel({
    name: 'City',
    code: 'city',
    live: true,
    languages,
    eventsEnabled: false,
    offersEnabled: false,
    poisEnabled: true,
    localNewsEnabled: false,
    tunewsEnabled: false,
    sortingName: 'City',
    latitude: 48.369696,
    longitude: 10.892578,
    prefix: null,
    aliases: null,
    boundingBox: [10.7880103, 48.447238, 11.0174493, 48.297834],
  }),
  new CityModel({
    name: 'Other city',
    code: 'otherCity',
    live: true,
    languages,
    eventsEnabled: false,
    offersEnabled: false,
    poisEnabled: false,
    localNewsEnabled: false,
    tunewsEnabled: false,
    sortingName: 'OtherCity',
    latitude: 48.369696,
    longitude: 10.892578,
    prefix: null,
    aliases: null,
    boundingBox: [10.7880103, 48.447238, 11.0174493, 48.297834],
  }),
  new CityModel({
    name: 'Notlive',
    code: 'nonlive',
    live: false,
    languages,
    eventsEnabled: false,
    offersEnabled: false,
    poisEnabled: true,
    localNewsEnabled: false,
    tunewsEnabled: false,
    sortingName: 'Nonlive',
    latitude: 0,
    longitude: 0,
    prefix: null,
    aliases: null,
    boundingBox: [0, 0, 0, 0],
  }),
  new CityModel({
    name: 'Yet another city',
    code: 'yetanothercity',
    live: true,
    languages,
    eventsEnabled: false,
    offersEnabled: false,
    poisEnabled: false,
    localNewsEnabled: false,
    tunewsEnabled: false,
    sortingName: 'Yetanothercity',
    latitude: 48.4,
    longitude: 10.8,
    prefix: null,
    aliases: null,
    boundingBox: [10.7880103, 48.447238, 11.0174493, 48.297834],
  }),
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
