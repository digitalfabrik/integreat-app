import findNormalizedMatches from '../findNormalizedMatches'
import normalizeString from '../normalizeString'

describe('findNormalizedMatches', () => {
  const sanitize = normalizeString

  it('should find sections with ß', () => {
    expect(findNormalizedMatches({ searchWords: ['ß'], textToHighlight: 'aßaßaß', sanitize })).toEqual([
      { start: 1, end: 2, highlight: false },
      { start: 3, end: 4, highlight: false },
      { start: 5, end: 6, highlight: false },
    ])
    expect(findNormalizedMatches({ searchWords: ['ß'], textToHighlight: 'wasserstraße', sanitize })).toEqual([
      { start: 2, end: 4, highlight: false },
      { start: 10, end: 11, highlight: false },
    ])
  })

  it('should find sections with ss', () => {
    expect(findNormalizedMatches({ searchWords: ['ss'], textToHighlight: 'aßaßaß', sanitize })).toEqual([
      { start: 1, end: 2, highlight: false },
      { start: 3, end: 4, highlight: false },
      { start: 5, end: 6, highlight: false },
    ])
    expect(findNormalizedMatches({ searchWords: ['ss'], textToHighlight: 'wasserstraße', sanitize })).toEqual([
      { start: 2, end: 4, highlight: false },
      { start: 10, end: 11, highlight: false },
    ])
  })

  it('should find sections of words', () => {
    expect(findNormalizedMatches({ searchWords: ['straße'], textToHighlight: 'Strassenstraße', sanitize })).toEqual([
      { start: 0, end: 7, highlight: false },
      { start: 8, end: 14, highlight: false },
    ])
    expect(findNormalizedMatches({ searchWords: ['städt'], textToHighlight: 'stadt städtchen', sanitize })).toEqual([
      { start: 0, end: 5, highlight: false },
      { start: 6, end: 11, highlight: false },
    ])
  })
})
