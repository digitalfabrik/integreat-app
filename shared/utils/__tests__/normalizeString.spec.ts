import normalizeString from '../normalizeString'

describe('normalizeString', () => {
  it('should normalize search string', () => {
    expect(normalizeString('Donauwörth')).toBe('donauworth')
    expect(normalizeString('äöUEJJ')).toBe('aouejj')
    expect(normalizeString('äöUEJJß')).toBe('aouejjß')
  })

  it('should trim whitespaces', () => {
    expect(normalizeString('   test  ')).toBe('test')
  })
})
