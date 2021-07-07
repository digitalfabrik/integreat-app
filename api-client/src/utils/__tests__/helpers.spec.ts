import { parseHTML } from '../helpers'

describe('Helper Methods', () => {
  describe('parseHTML', () => {
    it('should decode HTML entities', () => {
      const parsedResult = parseHTML('&#8220;&#8364;&#8221;', {
        decodeEntities: true
      })
      expect(parsedResult).toBe('“€”')
    })
  })
})
