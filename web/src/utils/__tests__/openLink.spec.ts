import openLink, { isInternalLink } from '../openLink'

describe('isInternalLink', () => {
  beforeEach(jest.resetAllMocks)

  it('should detect relative internal links', () => {
    expect(isInternalLink('/testumgebung/de')).toBe(true)
  })

  it('should detect internal urls', () => {
    expect(isInternalLink('https://integreat.app/testumgebung/de/my-page')).toBe(true)
  })

  it('should detect external urls', () => {
    expect(isInternalLink('https://example.com')).toBe(false)
    expect(isInternalLink('mailto:example@integreat.app')).toBe(false)
    expect(isInternalLink('https://admin.integreat-app.de/')).toBe(false)
  })
})

describe('openLink', () => {
  const navigate = jest.fn()
  window.open = jest.fn()

  beforeEach(jest.resetAllMocks)

  it('should navigate to relative internal links', () => {
    openLink(navigate, '/testumgebung/de')
    expect(navigate).toHaveBeenCalledTimes(1)
    expect(navigate).toHaveBeenCalledWith('/testumgebung/de')
    expect(window.open).not.toHaveBeenCalled()
  })

  it('should navigate to internal urls', () => {
    openLink(navigate, 'https://integreat.app/testumgebung/de/my-page')
    expect(navigate).toHaveBeenCalledTimes(1)
    expect(navigate).toHaveBeenCalledWith('/testumgebung/de/my-page')
    expect(window.open).not.toHaveBeenCalled()
  })

  it('should open external urls in a new tab', () => {
    openLink(navigate, 'https://example.com')
    expect(window.open).toHaveBeenCalledTimes(1)
    expect(window.open).toHaveBeenCalledWith('https://example.com', '_blank', 'noreferrer')
    expect(navigate).not.toHaveBeenCalled()
  })
})
