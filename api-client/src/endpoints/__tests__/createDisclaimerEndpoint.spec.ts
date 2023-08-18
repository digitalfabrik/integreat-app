import { DateTime } from 'luxon'

import PageModel from '../../models/PageModel'
import createDisclaimerEndpoint from '../createDisclaimerEndpoint'

describe('disclaimer', () => {
  const baseUrl = 'https://integreat-api-url.de'
  const disclaimer = createDisclaimerEndpoint(baseUrl)
  const pageJson = {
    path: '/augsburg/en/disclaimer/feedback-contact-and-opportunities-to-take-part/',
    title: 'Feedback, Kontakt und mögliches Engagement',
    type: 'disclaimer',
    last_updated: '2022-06-29T09:19:57.443+02:00',
    content: '<div>Some disclaimer test content :)</div>',
  }
  const params = {
    city: 'augsburg',
    language: 'de',
  }
  it('should map router to url', () => {
    expect(disclaimer.mapParamsToUrl(params)).toBe(
      'https://integreat-api-url.de/augsburg/de/wp-json/extensions/v3/disclaimer/',
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
        lastUpdate: DateTime.fromISO('2022-06-29T09:19:57.443+02:00'),
      }),
    )
  })
})
