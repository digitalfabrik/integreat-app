// @flow

import createDisclaimerEndpoint from '../createDisclaimerEndpoint'
import PageModel from '../../models/PageModel'
import moment from 'moment-timezone'

describe('disclaimer', () => {
  const baseUrl = 'https://integreat-api-url.de'
  const disclaimer = createDisclaimerEndpoint(baseUrl)

  const pageJson = {
    path: '/augsburg/en/disclaimer/feedback-contact-and-opportunities-to-take-part/',
    title: 'Feedback, Kontakt und mögliches Engagement',
    type: 'disclaimer',
    modified_gmt: '2017-06-12 12:27:57',
    content: '<a href="javascript:IWantToBeRemoved();">Ich bleib aber da.</a>',
    hash: '91d435afbc7aa83496137e81fd2832e3'
  }

  const params = {city: 'augsburg', language: 'de'}

  it('should map router to url', () => {
    expect(disclaimer.mapParamsToUrl(params)).toEqual(
      'https://integreat-api-url.de/augsburg/de/wp-json/extensions/v3/disclaimer'
    )
  })

  it('should throw if there is no disclaimer', () => {
    expect(() => disclaimer.mapResponse(null, params)).toThrowErrorMatchingSnapshot()
  })

  it('should map fetched data to models', () => {
    const disclaimerModel = disclaimer.mapResponse(pageJson, params)
    expect(disclaimerModel).toEqual(new PageModel({
      path: '/augsburg/en/disclaimer/feedback-contact-and-opportunities-to-take-part',
      title: pageJson.title,
      content: '<a>Ich bleib aber da.</a>',
      lastUpdate: moment.tz('2017-06-12 12:27:57', 'GMT'),
      hash: '91d435afbc7aa83496137e81fd2832e3'
    }))
  })
})
