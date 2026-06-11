import { findNormalizedMatches, findWordStartMatches } from '../findNormalizedMatches.js'
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
    expect(findWordStartMatches({ searchWords: ['land'], textToHighlight: 'Landkreis', sanitize })).toEqual([
      { start: 0, end: 4, highlight: false },
    ])
  })

  it('should find a match after a space', () => {
    expect(findWordStartMatches({ searchWords: ['b'], textToHighlight: 'Landkreis Birkenfeld', sanitize })).toEqual([
      { start: 10, end: 11, highlight: false },
    ])
  })

  it('should find a match after a dash', () => {
    expect(
      findWordStartMatches({ searchWords: ['hoch'], textToHighlight: 'Breisgau-Hochschwarzwald', sanitize }),
    ).toEqual([{ start: 9, end: 13, highlight: false }])
  })

  it('should not find a mid-word match', () => {
    expect(findWordStartMatches({ searchWords: ['a'], textToHighlight: 'Landkreis', sanitize })).toEqual([])
  })

  it('should find word containing ss with search word ß', () => {
    expect(findWordStartMatches({ searchWords: ['Straße'], textToHighlight: 'Strasse', sanitize })).toEqual([
      { start: 0, end: 7, highlight: false },
    ])
  })

  it('should find word containing ß with search word ss', () => {
    expect(findWordStartMatches({ searchWords: ['Strasse'], textToHighlight: 'Straße', sanitize })).toEqual([
      { start: 0, end: 6, highlight: false },
    ])
  })
})
