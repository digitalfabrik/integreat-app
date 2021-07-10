import { decodeHtmlEntities } from '../helpers'

describe('Helper Methods', () => {
  describe('decodeHtmlEntities', () => {
    it('should decode HTML entities', () => {
      const parsedResult = decodeHtmlEntities('&#8220;&#8364;&#8221;')
      expect(parsedResult).toBe('“€”')
    })
  })
})
