// @flow

import ContentNotFoundError from '../ContentNotFoundError'

describe('ContentNotFoundError', () => {

  it('should have correct message', () => {
    const error = new ContentNotFoundError(
      { type: 'category', id: '/augsburg/de/test', city: 'augsburg', language: 'language' }
    )

    expect(error.message).toMatchSnapshot()
  })

  it('should produce a stacktrace', () => {
    try {
      throw new ContentNotFoundError(
        { type: 'category', id: '/augsburg/de/test', city: 'augsburg', language: 'language' }
      )
    } catch (error) {
      expect(error.stack).toContain('ContentNotFoundError.js:17')
    }
  })
})
