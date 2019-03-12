// @flow

import pois from '../pois'
import moment from 'moment'
import PoiModel from '../../models/PoiModel'
import LocationModel from '../../models/LocationModel'

jest.unmock('../pois')

describe('pois', () => {
  const apiUrl = 'https://integreat-api-url.de'

  const createPoi = id => ({
    id,
    path: '/augsburg/de/pois/asylpolitischer_fruehschoppen',
    title: 'Asylploitischer Frühschoppen',
    excerpt: 'Am Sonntag...',
    content: '<p>Am Sonntag...</p>',
    available_languages: [],
    thumbnail: '',
    location: {
      address: 'Wertachstr. 29',
      town: 'Augsburg',
      postcode: '86353'
    },
    modified_gmt: '2017-01-09'
  })

  const createPoiModel = id => new PoiModel({
    id,
    path: '/augsburg/de/pois/asylpolitischer_fruehschoppen',
    title: 'Asylploitischer Frühschoppen',
    excerpt: 'Am Sonntag...',
    content: '<p>Am Sonntag...</p>',
    availableLanguages: new Map(),
    thumbnail: '',
    location: new LocationModel({
      address: 'Wertachstr. 29',
      town: 'Augsburg',
      postcode: '86353'
    }),
    lastUpdate: moment('2017-01-09')
  })

  const poi1 = createPoi(2730)
  const poi2 = createPoi(1889)
  const poi3 = createPoi(4768) // we get these from cms
  const poi4 = createPoi(4826)

  const poiModel1 = createPoiModel(2730)
  const poiModel2 = createPoiModel(1889)
  const poiModel3 = createPoiModel(4768)
  const poiModel4 = createPoiModel(4826)

  const params = {city: 'augsburg', language: 'de'}

  it('should map params to url', () => {
    expect(pois.mapParamsToUrl(apiUrl, params)).toEqual(
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
