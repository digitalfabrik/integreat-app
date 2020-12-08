// @flow

import moment from 'moment-timezone'
import createPOIsEndpoint from '../createPOIsEndpoint'
import PoiModel from '../../models/PoiModel'
import LocationModel from '../../models/LocationModel'

describe('pois', () => {
  const baseUrl = 'https://integreat-api-url.de'
  const pois = createPOIsEndpoint(baseUrl)

  const createPoi = id => ({
    id,
    path: '/augsburg/de/pois/asylpolitischer_fruehschoppen',
    title: 'Asylploitischer Frühschoppen',
    excerpt: 'Am Sonntag...',
    content: '<p>Am Sonntag...</p>',
    available_languages: [],
    thumbnail: '',
    location: {
      name: 'Café Tür an Tür',
      address: 'Wertachstr. 29',
      town: 'Augsburg',
      state: 'Bayern',
      postcode: '86353',
      region: 'Schwaben',
      country: 'DE'
    },
    modified_gmt: '2017-01-09 15:30:00',
    hash: '91d435afbc7aa83496137e81fd2832e3'
  })

  const createPoiModel = () => new PoiModel({
    path: '/augsburg/de/pois/asylpolitischer_fruehschoppen',
    title: 'Asylploitischer Frühschoppen',
    excerpt: 'Am Sonntag...',
    content: '<p>Am Sonntag...</p>',
    availableLanguages: new Map(),
    thumbnail: '',
    location: new LocationModel({
      name: 'Café Tür an Tür',
      address: 'Wertachstr. 29',
      town: 'Augsburg',
      state: 'Bayern',
      postcode: '86353',
      region: 'Schwaben',
      country: 'DE'
    }),
    lastUpdate: moment.tz('2017-01-09 15:30:00', 'GMT'),
    hash: '91d435afbc7aa83496137e81fd2832e3'
  })

  const poi1 = createPoi(2730)
  const poi2 = createPoi(1889)
  const poi3 = createPoi(4768) // we get these from cms
  const poi4 = createPoi(4826)

  const poiModel1 = createPoiModel()
  const poiModel2 = createPoiModel()
  const poiModel3 = createPoiModel()
  const poiModel4 = createPoiModel()

  const params = { city: 'augsburg', language: 'de' }

  it('should map params to url', () => {
    expect(pois.mapParamsToUrl(params)).toEqual(
      'https://integreat-api-url.de/augsburg/de/wp-json/extensions/v3/locations'
    )
  })

  const json = [
    poi1,
    poi2,
    poi3,
    poi4
  ]

  it('should map fetched data to models', () => {
    const poisModels = pois.mapResponse(json, params)

    const value = [
      poiModel1,
      poiModel2,
      poiModel3,
      poiModel4
    ]
    expect(poisModels).toEqual(value)
  })
})
