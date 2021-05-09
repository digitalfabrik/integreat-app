import buildResourceFilePath from '../buildResourceFilePath'
import { hashUrl } from 'api-client'
jest.mock('rn-fetch-blob')
describe('buildResourceFilePath', () => {
  it('should return the resource file path', () => {
    const urlString = 'https://ex.am/p.l/thumbnail.png'
    const city = 'augsburg'
    const hash = hashUrl(urlString)
    expect(buildResourceFilePath(urlString, city, hash)).toBe(
      'path/to/documentDir/resource-cache/v1/augsburg/files/81a74f17bb169f4dad2f59bb2e4670f9.png'
    )
  })
  it('should ignore invalid extension', () => {
    const urlString = 'https://ex.am/p.l/thumbnail'
    const city = 'augsburg'
    const hash = hashUrl(urlString)
    expect(buildResourceFilePath(urlString, city, hash)).toBe(
      'path/to/documentDir/resource-cache/v1/augsburg/files/ca7e91ecc6bcae6a2559357ba66cfc34'
    )
  })
  it('should throw if url is invalid', () => {
    const urlString = 'invalid-url'
    const city = 'augsburg'
    const hash = hashUrl(urlString)
    expect(() => buildResourceFilePath(urlString, city, hash)).toThrow('URL')
  })
})
