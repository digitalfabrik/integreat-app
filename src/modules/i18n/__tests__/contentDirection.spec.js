// @flow

describe('contentDirection', () => {
  describe('isContentDirectionReversalRequired', () => {
    afterEach(() => {
      jest.resetModules()
    })
    it('should return true if supplied language has reverse direction of system language', () => {
      jest.mock('react-native', () => {
        return { I18nManager: { isRTL: true } }
      })
      const contentDirection = require('../contentDirection')
      expect(contentDirection.isContentDirectionReversalRequired('en')).toBe(true)
    })

    it('should return false if supplied language has same direction as system language', () => {
      jest.mock('react-native', () => {
        return { I18nManager: { isRTL: false } }
      })
      const contentDirection = require('../contentDirection')
      expect(contentDirection.isContentDirectionReversalRequired('en')).toBe(false)
    })
  })

  describe('contentDirection', () => {
    afterEach(() => {
      jest.resetModules()
    })
    it('should return row-reverse if supplied language has reverse direction of system language', () => {
      jest.mock('react-native', () => {
        return { I18nManager: { isRTL: true } }
      })
      const contentDirection = require('../contentDirection')
      expect(contentDirection.contentDirection('en')).toBe('row-reverse')
    })

    it('should return row if supplied language has same direction as system language', () => {
      jest.mock('react-native', () => {
        return { I18nManager: { isRTL: false } }
      })
      const contentDirection = require('../contentDirection')
      expect(contentDirection.contentDirection('en')).toBe('row')
    })
  })
})
