// @flow

import ContentNotFoundError from '../ContentNotFoundError'
import { escapeRegExp } from 'lodash/string'

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
      expect(error.stack).toMatch(new RegExp(`${escapeRegExp(__filename)}:\\d+:\\d+`)) /* Matches the first line
                                                                                          in stack */
    }
  })
})
