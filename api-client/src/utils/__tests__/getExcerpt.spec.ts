import getExcerpt, { truncate } from '../getExcerpt'

describe('truncate', () => {
  const TEST_CUTOFF = 10

  it('should return short texts unchanged', () => {
    const truncatedText = truncate('Short', { maxChars: TEST_CUTOFF })
    expect(truncatedText).toBe('Short')
  })

  it('should strip texts even if they are shorter than the cutoff', () => {
    const truncatedText = truncate('\n  Short ', { maxChars: TEST_CUTOFF })
    expect(truncatedText).toBe('Short')
  })

  it('should truncate text at whitespace before cutoff', () => {
    const truncatedText = truncate('Before after', { maxChars: TEST_CUTOFF })
    expect(truncatedText).toBe('Before ...')
  })

  it('should strip whitespace before ellipses', () => {
    const truncatedText = truncate('First\n\n\n\n\n\n\n\n\n\nSecond', { maxChars: TEST_CUTOFF })
    expect(truncatedText).toBe('First ...')
  })

  describe('reverse', () => {
    it('should truncate text at whitespace after cutoff', () => {
      const truncatedText = truncate('Before after', { maxChars: TEST_CUTOFF, reverse: true })
      expect(truncatedText).toBe('... after')
    })

    it('should trim whitespace after ellipses', () => {
      const truncatedText = truncate('First\n\n\n\n\n\n\n\n\n\nSecond', { maxChars: TEST_CUTOFF, reverse: true })
      expect(truncatedText).toBe('... Second')
    })
  })
})

describe('getExcerpt', () => {
  const longText =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  const maxChars = 40

  it('should handle empty text', () => {
    const excerpt = getExcerpt(longText, { maxChars })
    expect(excerpt).toBe('Lorem ipsum dolor sit amet, ...')
  })

  it('should return correct excerpt if there is no query', () => {
    const excerpt = getExcerpt(longText, { maxChars })
    expect(excerpt).toBe('Lorem ipsum dolor sit amet, ...')
  })

  it('should return correct excerpt if there is an empty query', () => {
    const excerpt = getExcerpt(longText, { maxChars, query: '' })
    expect(excerpt).toBe('Lorem ipsum dolor sit amet, ...')
  })

  it('should return correct excerpt if there is no match', () => {
    const excerpt = getExcerpt(longText, { maxChars, query: 'no match' })
    expect(excerpt).toBe('Lorem ipsum dolor sit amet, ...')
  })

  it('should return correct excerpt if the string is shorter than max chars', () => {
    const shortText = 'Lorem ipsum dolor'
    const excerpt = getExcerpt(shortText, { maxChars, query: 'ipsum' })
    expect(excerpt).toBe(shortText)
  })

  it('should return correct excerpt if there is a match at the first char', () => {
    const excerpt = getExcerpt(longText, { maxChars, query: 'Lor' })
    expect(excerpt).toBe('Lorem ipsum dolor sit amet, ...')
  })

  it('should return correct excerpt if there is a match before half of max chars', () => {
    const excerpt = getExcerpt(longText, { maxChars, query: 'ip' })
    expect(excerpt).toBe('Lorem ipsum dolor sit amet, ...')
  })

  it('should return correct excerpt if there is a match in the middle of a long string', () => {
    const excerpt = getExcerpt(longText, { maxChars, query: 'eiusmod' })
    expect(excerpt).toBe('... elit, sed do eiusmod tempor ...')
  })

  it('should return correct excerpt if there is a match closer than half of max chars to the end', () => {
    const excerpt = getExcerpt(longText, { maxChars, query: 'mag' })
    expect(excerpt).toBe('... ut labore et dolore magna aliqua.')
  })

  it('should return correct excerpt if there is a match including the last char', () => {
    const excerpt = getExcerpt(longText, { maxChars, query: 'qua.' })
    expect(excerpt).toBe('... ut labore et dolore magna aliqua.')
  })

  it('should return truncated query if query is longer than max chars', () => {
    const excerpt = getExcerpt(longText, { maxChars: 10, query: 'sed do eiusmod' })
    expect(excerpt).toBe('sed do ...')
  })
})
