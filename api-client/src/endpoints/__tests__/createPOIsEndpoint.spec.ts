import moment from 'moment-timezone'
import createPOIsEndpoint from '../createPOIsEndpoint'
import PoiModel from '../../models/PoiModel'
import LocationModel from '../../models/LocationModel'

describe('pois', () => {
  const baseUrl = 'https://integreat-api-url.de'
  const pois = createPOIsEndpoint(baseUrl)

  const createPoi = (id: number, content: string) => ({
    id,
    path: '/augsburg/de/pois/asylpolitischer_fruehschoppen',
    title: 'Asylploitischer Frühschoppen',
    excerpt: 'Am Sonntag...',
    content,
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

  const createPoiModel = (content: string) =>
    new PoiModel({
      path: '/augsburg/de/pois/asylpolitischer_fruehschoppen',
      title: 'Asylploitischer Frühschoppen',
      excerpt: 'Am Sonntag...',
      content,
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

  const poi1 = createPoi(2730, '<a href="javascript:IWantToBeRemoved();">Ich bleib aber da.</a>')
  const poi2 = createPoi(1889, '<p>Am Sonntag...</p>')
  const poi3 = createPoi(4768, '<p>Am Sonntag...</p>')
  const poi4 = createPoi(4826, '<p>Am Sonntag...</p>')

  const poiModel1 = createPoiModel('<a>Ich bleib aber da.</a>')
  const poiModel2 = createPoiModel('<p>Am Sonntag...</p>')
  const poiModel3 = createPoiModel('<p>Am Sonntag...</p>')
  const poiModel4 = createPoiModel('<p>Am Sonntag...</p>')
  const params = {
    city: 'augsburg',
    language: 'de'
  }

  it('should map params to url', () => {
    expect(pois.mapParamsToUrl(params)).toEqual(
      'https://integreat-api-url.de/augsburg/de/wp-json/extensions/v3/locations'
    )
  })
  const json = [poi1, poi2, poi3, poi4]

  it('should map fetched data to models', () => {
    const poisModels = pois.mapResponse(json, params)
    const value = [poiModel1, poiModel2, poiModel3, poiModel4]
    expect(poisModels).toEqual(value)
  })

  it('should sanitize html', () => {
    const json = [{ ...poi1, content: '<a><script>alert("XSSS");</script>Ich bleib aber da.</a>' }]
    expect(pois.mapResponse(json, params)).toEqual([poiModel1])
  })
})
