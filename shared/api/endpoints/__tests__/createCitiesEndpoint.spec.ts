import { API_VERSION } from '../../constants'
import CityModel from '../../models/CityModel'
import LanguageModel from '../../models/LanguageModel'
import { JsonCityType, JsonLanguageType } from '../../types'
import createCitiesEndpoint from '../createCitiesEndpoint'

describe('cities', () => {
  const baseUrl = 'https://integreat-api-url.de'
  const cities = createCitiesEndpoint(baseUrl)
  const languagesJson: JsonLanguageType[] = [
    {
      code: 'en',
      native_name: 'English',
    },
    {
      code: 'de',
      native_name: 'Deutsch',
    },
    {
      code: 'ar',
      native_name: '\u0627\u0644\u0639\u0631\u0628\u064a\u0629',
    },
  ]
  const languages = [
    new LanguageModel('ar', '\u0627\u0644\u0639\u0631\u0628\u064a\u0629'),
    new LanguageModel('de', 'Deutsch'),
    new LanguageModel('en', 'English'),
  ]
  const city1: JsonCityType = {
    name: 'Augsburg',
    path: '/augsburg/',
    languages: languagesJson,
    live: true,
    events: true,
    pois: true,
    tunews: true,
    push_notifications: true,
    name_without_prefix: 'Augsburg',
    prefix: null,
    longitude: 10.89779,
    latitude: 48.3705449,
    aliases: {
      Gersthofen: {
        longitude: 10.89779,
        latitude: 48.3705449,
      },
    },
    bounding_box: [
      [10.7880103, 48.447238],
      [11.0174493, 48.297834],
    ],
    is_chat_enabled: false,
  }
  const city2: JsonCityType = {
    name: 'Stadt Regensburg',
    path: '/regensburg/',
    live: true,
    languages: languagesJson,
    events: false,
    tunews: false,
    pois: false,
    push_notifications: false,
    name_without_prefix: 'Regensburg',
    prefix: 'Stadt',
    latitude: 48.369696,
    longitude: 10.892578,
    aliases: null,
    bounding_box: [
      [12.055, 48.995],
      [12.145, 49.085],
    ],
    is_chat_enabled: false,
  }

  const cityJson = [city1, city2]

  it('should map params to url', () => {
    expect(cities.mapParamsToUrl()).toBe(`https://integreat-api-url.de/api/${API_VERSION}/regions/`)
  })

  it('should map fetched data to models', () => {
    const cityModels = cities.mapResponse(cityJson)
    expect(cityModels).toEqual([
      new CityModel({
        name: city1.name,
        code: 'augsburg',
        live: city1.live,
        languages,
        chatEnabled: false,
        eventsEnabled: true,
        poisEnabled: true,
        localNewsEnabled: true,
        tunewsEnabled: true,
        sortingName: 'Augsburg',
        prefix: null,
        longitude: 10.89779,
        latitude: 48.3705449,
        aliases: {
          Gersthofen: {
            longitude: 10.89779,
            latitude: 48.3705449,
          },
        },
        boundingBox: [10.7880103, 48.447238, 11.0174493, 48.297834],
      }),
      new CityModel({
        name: city2.name,
        code: 'regensburg',
        live: city2.live,
        languages,
        chatEnabled: false,
        eventsEnabled: false,
        poisEnabled: false,
        localNewsEnabled: false,
        tunewsEnabled: false,
        sortingName: 'Regensburg',
        prefix: 'Stadt',
        latitude: 48.369696,
        longitude: 10.892578,
        aliases: null,
        boundingBox: [12.055, 48.995, 12.145, 49.085],
      }),
    ])
  })
})
