// @flow

import replaceLinks from '../replaceLinks'

describe('replaceLinks', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const replace = jest.fn(match => match)

  it('should find http and https links', () => {
    replaceLinks('some content https://integreat.app/asdf with the correct http://links.qwer.tz', replace)
    expect(replace).toHaveBeenCalledTimes(2)
    expect(replace).toHaveReturnedWith('https://integreat.app/asdf')
    expect(replace).toHaveReturnedWith('http://links.qwer.tz')
  })

  it('should not match anything without protocol', () => {
    replaceLinks('some content integreat.app/werd mo.re/lin/ks', replace)
    expect(replace).not.toHaveBeenCalled()
  })

  it('should find mailto and tel', () => {
    replaceLinks('some content mailto:app@integreat-app.de with the correct tel:12345', replace)
    expect(replace).toHaveBeenCalledTimes(2)
    expect(replace).toHaveReturnedWith('mailto:app@integreat-app.de')
    expect(replace).toHaveReturnedWith('tel:12345')
  })

  it('should linkify links correctly', () => {
    expect(replaceLinks('some content https://asdf.gh with the correct mailto:links@qwer.tz'))
      .toBe('some content <a href="https://asdf.gh">https://asdf.gh</a> with the correct <a href="mailto:links@qwer.tz">mailto:links@qwer.tz</a>')
  })
})
