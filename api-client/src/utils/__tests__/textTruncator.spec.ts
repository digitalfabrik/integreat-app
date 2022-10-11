import textTruncator from '../textTruncator'

describe('textTruncator', () => {
  const TEST_CUTOFF = 10

  it('should return short texts unchanged', () => {
    const truncatedText = textTruncator('Short', TEST_CUTOFF)
    expect(truncatedText).toBe('Short')
  })

  it('should strip texts even if they are shorter than the cutoff', () => {
    const truncatedText = textTruncator('\n  Short ', TEST_CUTOFF)
    expect(truncatedText).toBe('Short')
  })

  it('should truncate text at whitespace before cutoff', () => {
    const truncatedText = textTruncator('Before after', TEST_CUTOFF)
    expect(truncatedText).toBe('Before...')
  })

  it('should strip whitespace before ellipses', () => {
    const truncatedText = textTruncator('First\n\n\n\n\n\n\n\n\n\nSecond', TEST_CUTOFF)
    expect(truncatedText).toBe('First...')
  })
})
