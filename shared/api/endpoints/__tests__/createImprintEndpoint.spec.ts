import { DateTime } from 'luxon'

import { API_VERSION } from '../../constants'
import DocumentModel from '../../models/DocumentModel'
import createImprintEndpoint from '../createImprintEndpoint'

describe('imprint', () => {
  const baseUrl = 'https://integreat-api-url.de'
  const imprint = createImprintEndpoint(baseUrl)
  const pageJson = {
    path: '/augsburg/en/imprint/feedback-contact-and-opportunities-to-take-part/',
    title: 'Feedback, Kontakt und mögliches Engagement',
    type: 'imprint',
    last_updated: '2022-06-29T09:19:57.443+02:00',
    content: '<div>Some imprint test content :)</div>',
  }
  const params = {
    region: 'augsburg',
    language: 'de',
  }
  it('should map router to url', () => {
    expect(imprint.mapParamsToUrl(params)).toBe(`https://integreat-api-url.de/api/${API_VERSION}/augsburg/de/imprint/`)
  })
  it('should throw if there is no imprint', () => {
    expect(() => imprint.mapResponse(null, params)).toThrow('The imprint  does not exist here.')
  })
  it('should map fetched data to models', () => {
    const imprintModel = imprint.mapResponse(pageJson, params)
    expect(imprintModel).toEqual(
      new DocumentModel({
        path: '/augsburg/en/imprint/feedback-contact-and-opportunities-to-take-part',
        title: pageJson.title,
        content: '<div>Some imprint test content :)</div>',
        lastUpdate: DateTime.fromISO('2022-06-29T09:19:57.443+02:00'),
      }),
    )
  })
})
