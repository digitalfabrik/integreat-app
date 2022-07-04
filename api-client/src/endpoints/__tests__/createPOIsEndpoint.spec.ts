import moment from 'moment-timezone'

import LocationModel from '../../models/LocationModel'
import PoiModel from '../../models/PoiModel'
import createPOIsEndpoint from '../createPOIsEndpoint'

describe('pois', () => {
  const baseUrl = 'https://integreat-api-url.de'
  const pois = createPOIsEndpoint(baseUrl)
  const path = '/augsburg/de/pois/asylpolitischer_fruehschoppen'

  const createPoi = (id: number) => ({
    id,
    path,
    title: 'Asylploitischer Frühschoppen',
    excerpt: 'Am Sonntag...',
    content: '<p>Am Sonntag...</p>',
    available_languages: [],
    thumbnail: '',
    website: null,
    phone_number: null,
    email: null,
    location: {
      id: 1,
      name: 'Café Tür an Tür',
      address: 'Wertachstr. 29',
      town: 'Augsburg',
      postcode: '86353',
      country: 'DE',
      longitude: 10.89779,
      latitude: 48.3705449
    },
    modified_gmt: '2017-01-09 15:30:00'
  })

  const createPoiModel = () =>
    new PoiModel({
      path,
      title: 'Asylploitischer Frühschoppen',
      excerpt: 'Am Sonntag...',
      content: '<p>Am Sonntag...</p>',
      availableLanguages: new Map(),
      thumbnail: '',
      website: null,
      phoneNumber: null,
      email: null,
      location: new LocationModel({
        id: 1,
        name: 'Café Tür an Tür',
        address: 'Wertachstr. 29',
        town: 'Augsburg',
        postcode: '86353',
        country: 'DE',
        longitude: 10.89779,
        latitude: 48.3705449
      }),
      lastUpdate: moment.tz('2017-01-09 15:30:00', 'GMT')
    })

  const poi1 = createPoi(2730)
  const poi2 = createPoi(1889)
  const poi3 = createPoi(4768) // we get these from cms
  const poi4 = createPoi(4826)

  const poiModel1 = createPoiModel()
  const poiModel2 = createPoiModel()
  const poiModel3 = createPoiModel()
  const poiModel4 = createPoiModel()
  const params = {
    city: 'augsburg',
    language: 'de'
  }
  it('should map params to url', () => {
    expect(pois.mapParamsToUrl(params)).toBe(
      'https://integreat-api-url.de/augsburg/de/wp-json/extensions/v3/locations?on_map=1'
    )
  })
  const json = [poi1, poi2, poi3, poi4]
  it('should map fetched data to models', () => {
    const poisModels = pois.mapResponse(json, params)
    const value = [poiModel1, poiModel2, poiModel3, poiModel4]
    expect(poisModels).toEqual(value)
  })
})
