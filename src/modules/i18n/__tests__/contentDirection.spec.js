// @flow

import { isContentDirectionReversalRequired } from '../contentDirection'

jest.mock('react-native', () => {
  return { I18nManager: { isRTL: true } }
})

describe('contentDirection', () => {
  describe('isContentDirectionReversalRequired', () => {
    it('should return true if supplied language has reverse direction of system language', () => {
      expect(isContentDirectionReversalRequired('en')).toBe(true)
    })
  })
})
