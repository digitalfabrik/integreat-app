import { parseHTMLEntities } from '../helpers'

describe('Helper Methods', () => {
  describe('parseHTMLEntities', () => {
    it('should decode HTML entities', () => {
      const parsedResult = parseHTMLEntities('&#8220;&#8364;&#8221;')
      expect(parsedResult).toBe('“€”')
    })
  })
})
