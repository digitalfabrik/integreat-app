import { API_VERSION } from '../../constants'
import LanguageModel from '../../models/LanguageModel'
import RegionModel from '../../models/RegionModel'
import { JsonRegionType, JsonLanguageType } from '../../types'
import createRegionsEndpoint from '../createRegionsEndpoint'

describe('regions', () => {
  const baseUrl = 'https://integreat-api-url.de'
  const regions = createRegionsEndpoint(baseUrl)
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
  const region1: JsonRegionType = {
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
    zammad_privacy_policy: null,
  }
  const region2: JsonRegionType = {
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
    zammad_privacy_policy: 'https://example.com/privacy',
  }

  const regionJson = [region1, region2]

  it('should map params to url', () => {
    expect(regions.mapParamsToUrl()).toBe(`https://integreat-api-url.de/api/${API_VERSION}/regions/`)
  })

  it('should map fetched data to models', () => {
    const regionModels = regions.mapResponse(regionJson)
    expect(regionModels).toEqual([
      new RegionModel({
        name: region1.name,
        code: 'augsburg',
        live: region1.live,
        languages,
        chatEnabled: false,
        chatPrivacyPolicyUrl: null,
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
      new RegionModel({
        name: region2.name,
        code: 'regensburg',
        live: region2.live,
        languages,
        chatEnabled: false,
        chatPrivacyPolicyUrl: 'https://example.com/privacy',
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
