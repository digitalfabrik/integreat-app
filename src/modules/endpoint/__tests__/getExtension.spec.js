// @flow

import getExtension from '../getExtension'

describe('getExtension', () => {
  it('should return the extension of a regular file-url', () => {
    expect(getExtension('https://ex.am/p.l/thumbnail.png')).toBe('png')
  })
  it('should throw if pathname has no extension', () => {
    expect(() => getExtension('https://ex.am/')).toThrowError('The URL does not have an extension!')
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
  it('should throw if there is no extension', () => {
    expect(() => getExtension('https://ex.am/p.l/thumbnail')).toThrow('The URL does not have an extension!')
    expect(() => getExtension('thumbnail')).toThrow('Invalid URL')
  })
})
