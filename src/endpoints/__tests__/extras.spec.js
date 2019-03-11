// @flow

import extras from '../extras'
import ExtraModel from '../../models/ExtraModel'

jest.unmock('../extras')

describe('endpoint', () => {
  const apiUrl = 'https://integreat-api-url.de'

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

  const extraModels = [
    new ExtraModel({
      alias: 'serlo-abc',
      thumbnail: 'some_thumbnail',
      title: 'Serlo ABC',
      path: 'https://abc-app.serlo.org/',
      postData: null
    }),
    new ExtraModel({
      alias: 'sprungbrett',
      thumbnail: 'some_other_thumbnail',
      title: 'Sprungbrett',
      path: 'https://web.integreat-app.de/proxy/sprungbrett/app-search-internships?location=augsburg',
      postData: null
    }),
    new ExtraModel({
      alias: 'lehrstellen-radar',
      thumbnail: 'some_other_thumbnail',
      title: 'Lehrstellenradar',
      path: 'https://www.lehrstellen-radar.de/5100,0,lsrlist.html',
      postData: lehrstellenRadarPostData
    })
  ]

  const params = {city: 'bad-toelz', language: 'en'}

  it('should map router to url', () => {
    expect(extras.mapParamsToUrl(apiUrl, params)).toEqual(
      'https://integreat-api-url.de/bad-toelz/en/wp-json/extensions/v3/extras'
    )
  })

  it('should throw if the city to map the url are missing', () => {
    expect(() => extras.mapParamsToUrl(apiUrl, {city: undefined, language: 'de'})).toThrowErrorMatchingSnapshot()
  })

  it('should throw if the language to map the url are missing', () => {
    expect(() => extras.mapParamsToUrl(apiUrl, {city: 'city', language: undefined})).toThrowErrorMatchingSnapshot()
  })

  it('should map json to models', () => {
    const disclaimerModel = extras.mapResponse(pageJson, params)
    expect(disclaimerModel).toEqual(extraModels)
  })
})
