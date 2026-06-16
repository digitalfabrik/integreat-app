import findNormalizedMatches from '../findNormalizedMatches.js'
import normalizeString from '../normalizeString.js'

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

  it('should find a match at the start of the string', () => {
    expect(
      findNormalizedMatches({ searchWords: ['land'], textToHighlight: 'Landkreis', sanitize }, { wordStartOnly: true }),
    ).toEqual([{ start: 0, end: 4, highlight: false }])
  })

  it('should find a match after a space', () => {
    expect(
      findNormalizedMatches(
        { searchWords: ['b'], textToHighlight: 'Landkreis Birkenfeld', sanitize },
        { wordStartOnly: true },
      ),
    ).toEqual([{ start: 10, end: 11, highlight: false }])
  })

  it('should find a match after a dash', () => {
    expect(
      findNormalizedMatches(
        { searchWords: ['hoch'], textToHighlight: 'Breisgau-Hochschwarzwald', sanitize },
        { wordStartOnly: true },
      ),
    ).toEqual([{ start: 9, end: 13, highlight: false }])
  })

  it('should not find a mid-word match', () => {
    expect(
      findNormalizedMatches({ searchWords: ['a'], textToHighlight: 'Landkreis', sanitize }, { wordStartOnly: true }),
    ).toEqual([])
  })

  it('should find word containing ss with search word ß', () => {
    expect(
      findNormalizedMatches({ searchWords: ['Straße'], textToHighlight: 'Strasse', sanitize }, { wordStartOnly: true }),
    ).toEqual([{ start: 0, end: 7, highlight: false }])
  })

  it('should find word containing ß with search word ss', () => {
    expect(
      findNormalizedMatches({ searchWords: ['Strasse'], textToHighlight: 'Straße', sanitize }, { wordStartOnly: true }),
    ).toEqual([{ start: 0, end: 6, highlight: false }])
  })
})
