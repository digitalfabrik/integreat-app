// @flow

import { isContentDirectionReversalRequired } from '../contentDirection'

jest.mock('react-native', () => {
  const I18nManager = { isRTL: true }
  return { I18nManager }
})

describe('contentDirection', () => {
  it('should work', () => {
    expect(isContentDirectionReversalRequired('de')).toBe(true)
  })
})
