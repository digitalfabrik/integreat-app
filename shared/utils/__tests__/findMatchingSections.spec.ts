import { findMatchingSections } from '../findMatchingSections'

describe('findMatchingSections', () => {
  it('should find sections with ß', () => {
    expect(findMatchingSections({ searchWords: ['ß'], textToHighlight: 'aßaßaß' })).toEqual([
      { start: 1, end: 2 },
      { start: 3, end: 4 },
      { start: 5, end: 6 },
    ])
    expect(findMatchingSections({ searchWords: ['ß'], textToHighlight: 'wasserstraße' })).toEqual([
      { start: 2, end: 4 },
      { start: 10, end: 11 },
    ])
  })
  it('should find sections with ss', () => {
    expect(findMatchingSections({ searchWords: ['ss'], textToHighlight: 'aßaßaß' })).toEqual([
      { start: 1, end: 2 },
      { start: 3, end: 4 },
      { start: 5, end: 6 },
    ])
    expect(findMatchingSections({ searchWords: ['ss'], textToHighlight: 'wasserstraße' })).toEqual([
      { start: 2, end: 4 },
      { start: 10, end: 11 },
    ])
  })
  it('should find sections of words', () => {
    expect(findMatchingSections({ searchWords: ['straße'], textToHighlight: 'Strassenstraße' })).toEqual([
      { start: 0, end: 7 },
      { start: 8, end: 14 },
    ])
    expect(findMatchingSections({ searchWords: ['städt'], textToHighlight: 'stadt städtchen' })).toEqual([
      { start: 0, end: 5 },
      { start: 6, end: 11 },
    ])
  })
})
