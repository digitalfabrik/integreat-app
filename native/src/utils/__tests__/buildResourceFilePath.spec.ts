import { sha256 } from 'js-sha256'

import buildResourceFilePath from '../buildResourceFilePath'

describe('buildResourceFilePath', () => {
  it('should return the resource file path', () => {
    const urlString = 'https://ex.am/p.l/thumbnail.png'
    const region = 'augsburg'
    const hash = sha256(urlString)
    expect(buildResourceFilePath(urlString, region, hash)).toBe(
      'path/to/documentDir/resource-cache/v4/augsburg/files/5aea0ed0ef75df32615272662c0419c858bfd800926bb1563a5012023ac3a6b7.png',
    )
  })
  it('should ignore invalid extension', () => {
    const urlString = 'https://ex.am/p.l/thumbnail'
    const region = 'augsburg'
    const hash = sha256(urlString)
    expect(buildResourceFilePath(urlString, region, hash)).toBe(
      'path/to/documentDir/resource-cache/v4/augsburg/files/c7e63b8dcf9e58e00e07ce99959384769c626aa25a78cce33a3863023155194f',
    )
  })
  it('should throw if url is invalid', () => {
    const urlString = 'invalid-url'
    const region = 'augsburg'
    const hash = sha256(urlString)
    expect(() => buildResourceFilePath(urlString, region, hash)).toThrow('URL')
  })
})
