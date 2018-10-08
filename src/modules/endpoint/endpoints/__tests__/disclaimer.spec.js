// @flow

import disclaimer from '../disclaimer'
import DisclaimerModel from '../../models/DisclaimerModel'
import moment from 'moment'

jest.unmock('../disclaimer')

describe('disclaimer', () => {
  const pageJson = {
    id: 1689,
    title: 'Feedback, Kontakt und mögliches Engagement',
    type: 'disclaimer',
    modified_gmt: '2017-06-12 12:27:57',
    content: '<span>Content</span>'
  }

  const params = {city: 'augsburg', language: 'de'}

  it('should map router to url', () => {
    expect(disclaimer.mapParamsToUrl(params)).toEqual(
      'https://cms.integreat-app.de/augsburg/de/wp-json/extensions/v3/disclaimer'
    )
  })

  it('should throw if there is no disclaimer', () => {
    expect(() => disclaimer.mapResponse(null, params)).toThrowErrorMatchingSnapshot()
  })

  it('should map fetched data to models', () => {
    const disclaimerModel = disclaimer.mapResponse(pageJson, params)
    expect(disclaimerModel).toEqual(new DisclaimerModel({
      id: pageJson.id,
      title: pageJson.title,
      content: pageJson.content,
      lastUpdate: moment('2017-06-12 12:27:57')
    }))
  })
})
