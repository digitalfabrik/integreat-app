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
})
