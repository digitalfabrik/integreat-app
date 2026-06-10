import findNormalizedMatches from '../findNormalizedMatches.js'
import normalizeString from '../normalizeString.js'

describe('findNormalizedMatches', () => {
  const sanitize = normalizeString

  it('should find a match at the start of the string', () => {
    expect(findNormalizedMatches({ searchWords: ['land'], textToHighlight: 'Landkreis', sanitize })).toEqual([
      { start: 0, end: 4, highlight: false },
    ])
  })

  it('should find a match after a space', () => {
    expect(findNormalizedMatches({ searchWords: ['b'], textToHighlight: 'Landkreis Birkenfeld', sanitize })).toEqual([
      { start: 10, end: 11, highlight: false },
    ])
  })

  it('should find a match after a dash', () => {
    expect(
      findNormalizedMatches({ searchWords: ['hoch'], textToHighlight: 'Breisgau-Hochschwarzwald', sanitize }),
    ).toEqual([{ start: 9, end: 13, highlight: false }])
  })

  it('should not find a mid-word match', () => {
    expect(findNormalizedMatches({ searchWords: ['a'], textToHighlight: 'Landkreis', sanitize })).toEqual([])
  })

  it('should find word containing ss with search word ß', () => {
    expect(findNormalizedMatches({ searchWords: ['Straße'], textToHighlight: 'Strasse', sanitize })).toEqual([
      { start: 0, end: 7, highlight: false },
    ])
  })

  it('should find word containing ß with search word ss', () => {
    expect(findNormalizedMatches({ searchWords: ['Strasse'], textToHighlight: 'Straße', sanitize })).toEqual([
      { start: 0, end: 6, highlight: false },
    ])
  })
})
