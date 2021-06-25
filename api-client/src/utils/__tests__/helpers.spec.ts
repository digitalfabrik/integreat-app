import { parseHTML } from '../helpers'

describe('Helper Methods', () => {
  describe('parseHTML', () => {
    let parsedResult = ''
    const ontextFn = (data: string): void => {
      parsedResult += data
    }

    it('should decode HTML entities', () => {
      parseHTML('&#8220;&#8364;&#8221;', ontextFn)
      expect(parsedResult).toBe('“€”')
    })
  })
})
