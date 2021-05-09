// @flow

import contentLanguageReducer from '../contentLanguageReducer'

describe('contentLanguageReducer', () => {
  it('should return the content language', () => {
    expect(
      contentLanguageReducer('de', {
        type: 'SET_CONTENT_LANGUAGE',
        params: { contentLanguage: 'en' }
      })
    ).toBe('en')
  })
})
