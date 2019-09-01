// @flow

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
})
