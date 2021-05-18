import getExtension from '../getExtension'
describe('getExtension', () => {
  it('should return the extension of a regular file-url', () => {
    expect(getExtension('https://ex.am/p.l/thumbnail.png')).toBe('png')
  })
  it('should ignore any trailing query string', () => {
    expect(getExtension('https://ex.am/p.l/thumbnail.png?size=med')).toBe('png')
  })
  it('should ignore any trailing hash string', () => {
    expect(getExtension('https://ex.am/p.l/thumbnail.png#what-ever')).toBe('png')
  })
  it('should ignore any combined query and hash string', () => {
    expect(getExtension('https://ex.am/p.l/thumbnail.png#what-ever?this-is')).toBe('png')
    expect(getExtension('https://ex.am/p.l/thumbnail.png?what-ever#this-is')).toBe('png')
    expect(getExtension('https://ex.am/p.l#serjkd/thumbnail.png?what-ever#this-is')).toBe('l')
  })
  it('should throw if it is no valid url', () => {
    expect(() => getExtension('thumbnail')).toThrow('Invalid URL')
  })
  it('should return empty string if there is no extension', () => {
    expect(getExtension('https://ex.am/p.l/thumbnail')).toBe('')
  })
  it('should return empty string if there is no pathname', () => {
    expect(getExtension('https://ex.am/')).toBe('')
  })
})
