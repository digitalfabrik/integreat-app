import normalizeString from '../normalizeString'

describe('normalizeString', () => {
  it('should normalize search string', () => {
    expect(normalizeString('Donauwörth')).toBe('donauworth')
    expect(normalizeString('äöUEJJ')).toBe('aouejj')
    expect(normalizeString('äöUEJJß')).toBe('aouejjss')
  })

  it('should trim whitespaces', () => {
    expect(normalizeString('   test  ')).toBe('test')
  })

  it('should escape ß', () => {
    expect(normalizeString('Bergstraße')).toBe('bergstrasse')
    expect(normalizeString('äßoßsß')).toBe('assosssss')
  })

  it('should keep characters in non-latin alphabets', () => {
    expect(normalizeString('اللغة')).toBe('اللغة')
    expect(normalizeString('በጀርመን')).toBe('በጀርመን')
    expect(normalizeString('त')).toBe('त')
    expect(normalizeString('本页内容来自')).toBe('本页内容来自')
  })

  it('should keep numbers', () => {
    expect(normalizeString('غ12te57ة')).toBe('غ12te57ة')
  })
})
