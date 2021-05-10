// jest.resetModules() produces a invariant violation: Invalid hook call https://github.com/facebook/jest/issues/8987
describe('contentDirection', () => {
  describe('isContentDirectionReversalRequired', () => {
    it('should return true if supplied language has reverse direction of system language', () => {
      // @ts-ignore jest.isolateModules() undefined
      jest.isolateModules(() => {
        jest.doMock('react-native', () => {
          return {
            I18nManager: {
              isRTL: true
            }
          }
        })

        const contentDirection = require('../contentDirection')

        expect(contentDirection.isContentDirectionReversalRequired('en')).toBe(true)
      })
    })
    it('should return false if supplied language has same direction as system language', () => {
      // @ts-ignore jest.isolateModules() undefined
      jest.isolateModules(() => {
        jest.doMock('react-native', () => {
          return {
            I18nManager: {
              isRTL: false
            }
          }
        })

        const contentDirection = require('../contentDirection')

        expect(contentDirection.isContentDirectionReversalRequired('en')).toBe(false)
      })
    })
  })
  describe('contentDirection', () => {
    it('should return row-reverse if supplied language has reverse direction of system language', () => {
      // @ts-ignore jest.isolateModules() undefined
      jest.isolateModules(() => {
        jest.doMock('react-native', () => {
          return {
            I18nManager: {
              isRTL: true
            }
          }
        })

        const contentDirection = require('../contentDirection')

        expect(contentDirection.contentDirection('en')).toBe('row-reverse')
      })
    })
    it('should return row if supplied language has same direction as system language', () => {
      // @ts-ignore jest.isolateModules() undefined
      jest.isolateModules(() => {
        jest.doMock('react-native', () => {
          return {
            I18nManager: {
              isRTL: false
            }
          }
        })

        const contentDirection = require('../contentDirection')

        expect(contentDirection.contentDirection('en')).toBe('row')
      })
    })
  })
})
