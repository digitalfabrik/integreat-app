import moment from 'moment-timezone'

import PageModel from '../../models/PageModel'
import createDisclaimerEndpoint from '../createDisclaimerEndpoint'

describe('disclaimer', () => {
  const baseUrl = 'https://integreat-api-url.de'
  const disclaimer = createDisclaimerEndpoint(baseUrl)
  const pageJson = {
    path: '/augsburg/en/disclaimer/feedback-contact-and-opportunities-to-take-part/',
    title: 'Feedback, Kontakt und mögliches Engagement',
    type: 'disclaimer',
    modified_gmt: '2017-06-12 12:27:57',
    content: '<div>Some disclaimer test content :)</div>',
  }
  const params = {
    city: 'augsburg',
    language: 'de',
  }
  it('should map router to url', () => {
    expect(disclaimer.mapParamsToUrl(params)).toBe(
      'https://integreat-api-url.de/augsburg/de/wp-json/extensions/v3/disclaimer'
    )
  })
  it('should throw if there is no disclaimer', () => {
    expect(() => disclaimer.mapResponse(null, params)).toThrow('The disclaimer  does not exist here.')
  })
  it('should map fetched data to models', () => {
    const disclaimerModel = disclaimer.mapResponse(pageJson, params)
    expect(disclaimerModel).toEqual(
      new PageModel({
        path: '/augsburg/en/disclaimer/feedback-contact-and-opportunities-to-take-part',
        title: pageJson.title,
        content: '<div>Some disclaimer test content :)</div>',
        lastUpdate: moment.tz('2017-06-12 12:27:57', 'GMT'),
      })
    )
  })
})
