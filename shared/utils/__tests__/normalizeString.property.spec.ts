import fc from 'fast-check'

import normalizeString from '../normalizeString'

describe('normalizeString (property-based)', () => {
  it('should always return lowercase, trimmed output without ß', () => {
    fc.assert(
      fc.property(fc.string(), str => {
        const result = normalizeString(str)
        expect(result).toBe(result.toLowerCase())
        expect(result).toBe(result.trim())
        expect(result).not.toContain('ß')
      }),
    )
  })
})
