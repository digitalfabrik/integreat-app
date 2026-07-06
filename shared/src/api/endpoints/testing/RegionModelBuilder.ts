import RegionModel from '../../models/RegionModel.ts'
import LanguageModelBuilder from './LanguageModelBuilder.ts'

const languages = new LanguageModelBuilder(3).build()

const regions = [
  new RegionModel({
    name: 'Stadt Augsburg',
    code: 'augsburg',
    live: true,
    languages,
    eventsEnabled: true,
    placesEnabled: true,
    localNewsEnabled: true,
    tuNewsEnabled: true,
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
    chatEnabled: false,
    chatPrivacyPolicyUrl: null,
  }),
  new RegionModel({
    name: 'Oldtown',
    code: 'oldtown',
    live: false,
    languages,
    eventsEnabled: true,
    placesEnabled: false,
    localNewsEnabled: false,
    tuNewsEnabled: false,
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
    chatEnabled: false,
    chatPrivacyPolicyUrl: 'https://example.com/privacy',
  }),
  new RegionModel({
    name: 'Region',
    code: 'region',
    live: true,
    languages,
    eventsEnabled: false,
    placesEnabled: true,
    localNewsEnabled: false,
    tuNewsEnabled: false,
    sortingName: 'Region',
    latitude: 48.369696,
    longitude: 10.892578,
    prefix: null,
    aliases: null,
    boundingBox: [10.7880103, 48.447238, 11.0174493, 48.297834],
    chatEnabled: false,
    chatPrivacyPolicyUrl: null,
  }),
  new RegionModel({
    name: 'Other region',
    code: 'otherRegion',
    live: true,
    languages,
    eventsEnabled: false,
    placesEnabled: false,
    localNewsEnabled: false,
    tuNewsEnabled: false,
    sortingName: 'OtherRegion',
    latitude: 48.369696,
    longitude: 10.892578,
    prefix: null,
    aliases: null,
    boundingBox: [10.7880103, 48.447238, 11.0174493, 48.297834],
    chatEnabled: false,
    chatPrivacyPolicyUrl: null,
  }),
  new RegionModel({
    name: 'Notlive',
    code: 'nonlive',
    live: false,
    languages,
    eventsEnabled: false,
    placesEnabled: true,
    localNewsEnabled: false,
    tuNewsEnabled: false,
    sortingName: 'Nonlive',
    latitude: 0,
    longitude: 0,
    prefix: null,
    aliases: null,
    boundingBox: [0, 0, 0, 0],
    chatEnabled: false,
    chatPrivacyPolicyUrl: null,
  }),
  new RegionModel({
    name: 'Yet another region',
    code: 'yetanotherregion',
    live: true,
    languages,
    eventsEnabled: false,
    placesEnabled: false,
    localNewsEnabled: false,
    tuNewsEnabled: false,
    sortingName: 'Yetanotherregion',
    latitude: 48.4,
    longitude: 10.8,
    prefix: null,
    aliases: null,
    boundingBox: [10.7880103, 48.447238, 11.0174493, 48.297834],
    chatEnabled: false,
    chatPrivacyPolicyUrl: null,
  }),
]

class RegionModelBuilder {
  _regionsCount: number

  constructor(regionsCount: number) {
    this._regionsCount = regionsCount
    if (this._regionsCount > regions.length) {
      throw new Error(`Only ${regions.length} region models can be created`)
    }
  }

  build(): RegionModel[] {
    return regions.slice(0, this._regionsCount)
  }
}

export default RegionModelBuilder
