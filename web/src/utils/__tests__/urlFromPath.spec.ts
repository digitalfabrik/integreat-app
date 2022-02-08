import { urlFromPath } from '../stringUtils'

describe('urlFromPath', () => {
  it('should give the correct url', () => {
    // jest mocks the current host with localhost.
    expect(urlFromPath('/my-path')).toBe('http://localhost/my-path')
  })
})
