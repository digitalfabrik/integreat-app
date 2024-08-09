import { spacesToDashes, urlFromPath } from '../stringUtils'

describe('stringUtils', () => {
  describe('urlFromPath', () => {
    it('should give the correct url', () => {
      // jest mocks the current host with localhost.
      expect(urlFromPath('/my-path')).toBe('http://localhost/my-path')
    })
  })

  describe('spacesToDashes', () => {
    it('should return the right string', () => {
      expect(spacesToDashes('hello there')).toBe('hello-there')
      expect(spacesToDashes('hello')).toBe('hello')
      expect(spacesToDashes('hello-there')).toBe('hello-there')
    })
  })
})
