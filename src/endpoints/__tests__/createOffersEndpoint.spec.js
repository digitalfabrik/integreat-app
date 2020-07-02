// @flow

import createOffersEndpoint from '../createOffersEndpoint'
import OfferModel from '../../models/OfferModel'

describe('endpoint', () => {
  const baseUrl = 'https://integreat-api-url.de'
  const offers = createOffersEndpoint(baseUrl)

  const pageJson = [
    {
      name: 'Serlo ABC',
      alias: 'serlo-abc',
      url: 'https://abc-app.serlo.org/',
      post: null,
      thumbnail: 'some_thumbnail'
    },
    {
      name: 'Sprungbrett',
      alias: 'sprungbrett',
      url: 'https://web.integreat-app.de/proxy/sprungbrett/app-search-internships?location=augsburg',
      post: null,
      thumbnail: 'some_other_thumbnail'
    },
    {
      alias: 'lehrstellen-radar',
      name: 'Lehrstellenradar',
      url: 'https://www.lehrstellen-radar.de/5100,0,lsrlist.html',
      thumbnail: 'some_other_thumbnail',
      post: {partner: '0006', radius: '50', plz: '86150'}
    }
  ]

  const lehrstellenRadarPostData = new Map()
  lehrstellenRadarPostData.set('partner', '0006')
  lehrstellenRadarPostData.set('radius', '50')
  lehrstellenRadarPostData.set('plz', '86150')

  const offerModels = [
    new OfferModel({
      alias: 'serlo-abc',
      thumbnail: 'some_thumbnail',
      title: 'Serlo ABC',
      path: 'https://abc-app.serlo.org/',
      postData: null
    }),
    new OfferModel({
      alias: 'sprungbrett',
      thumbnail: 'some_other_thumbnail',
      title: 'Sprungbrett',
      path: 'https://web.integreat-app.de/proxy/sprungbrett/app-search-internships?location=augsburg',
      postData: null
    }),
    new OfferModel({
      alias: 'lehrstellen-radar',
      thumbnail: 'some_other_thumbnail',
      title: 'Lehrstellenradar',
      path: 'https://www.lehrstellen-radar.de/5100,0,lsrlist.html',
      postData: lehrstellenRadarPostData
    })
  ]

  const params = {city: 'bad-toelz', language: 'en'}

  it('should map router to url', () => {
    expect(offers.mapParamsToUrl(params)).toEqual(
      'https://integreat-api-url.de/bad-toelz/en/wp-json/extensions/v3/extras'
    )
  })

  it('should map json to models', () => {
    const disclaimerModel = offers.mapResponse(pageJson, params)
    expect(disclaimerModel).toEqual(offerModels)
  })
})
