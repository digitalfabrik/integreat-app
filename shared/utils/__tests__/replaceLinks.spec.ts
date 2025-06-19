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
    expect(replaceLinks('some content https://asdf.gh with the correct mailto:links@qwer.tz')).toBe(
      "some content <a href='https://asdf.gh'>https://asdf.gh</a> with the correct <a href='mailto:links@qwer.tz'>mailto:links@qwer.tz</a>",
    )
  })
  it('should not match trailing "."', () => {
    replaceLinks('some content https://integreat.app/asdf.', replace)
    expect(replace).toHaveBeenCalledTimes(1)
    expect(replace).toHaveReturnedWith('https://integreat.app/asdf')
  })
  it('should match "_2025.pdf"', () => {
    replaceLinks('some content https://bildung-test.de/fileadmin/media/pdf/test_2024.pdf', replace)
    expect(replace).toHaveBeenCalledTimes(1)
    expect(replace).toHaveReturnedWith('https://bildung-test.de/fileadmin/media/pdf/test_2024.pdf')
  })

  it('should match arabic non-ASCII chars in pathname, query and hash', () => {
    replaceLinks(
      'https://webnext.integreat.app/testumgebung/ar/الحياة-اليومية/الإنترنت-وخدمة-الواي-فاي-المجانية?asdf=لحياة-اليومية#hüh',
      replace,
    )
    expect(replace).toHaveBeenCalledTimes(1)
    expect(replace).toHaveReturnedWith(
      'https://webnext.integreat.app/testumgebung/ar/الحياة-اليومية/الإنترنت-وخدمة-الواي-فاي-المجانية?asdf=لحياة-اليومية#hüh',
    )
  })

  it('should match cyrillic non-ASCII chars in pathname, query and hash', () => {
    replaceLinks(
      'some content https://integreat.app/asdf/de/инфор.мация-помощь-украине/разрешение-на-временное-го-года?asdf=nö#hüh',
      replace,
    )
    expect(replace).toHaveBeenCalledTimes(1)
    expect(replace).toHaveReturnedWith(
      'https://integreat.app/asdf/de/инфор.мация-помощь-украине/разрешение-на-временное-го-года?asdf=nö#hüh',
    )
  })

  it('should match greek non-ASCII chars in pathname, query and hash', () => {
    replaceLinks(
      'https://webnext.integreat.app/augsburg/el/ζώντας/αναζήτηση-κατοικίας/αναζήτηση-μέσω-εφημερίδας',
      replace,
    )
    expect(replace).toHaveBeenCalledTimes(1)
    expect(replace).toHaveReturnedWith(
      'https://webnext.integreat.app/augsburg/el/ζώντας/αναζήτηση-κατοικίας/αναζήτηση-μέσω-εφημερίδας',
    )
  })

  it('should add mailto to email addresses', () => {
    expect(replaceLinks('Please contact app@integreat-app.de')).toBe(
      "Please contact <a href='mailto:app@integreat-app.de'>app@integreat-app.de</a>",
    )
  })

  it('should not add mailto when already present', () => {
    expect(replaceLinks('Send to mailto:app@integreat-app.de')).toBe(
      "Send to <a href='mailto:app@integreat-app.de'>mailto:app@integreat-app.de</a>",
    )
  })

  it('should match links separately', () => {
    replaceLinks(
      'https://stackoverflow.com/a/150078 https://stackoverflow.com/a/150079\nhttps://stackoverflow.com/a/160078',
      replace,
    )
    expect(replace).toHaveBeenCalledTimes(3)
    expect(replace).toHaveReturnedWith('https://stackoverflow.com/a/150078')
    expect(replace).toHaveReturnedWith('https://stackoverflow.com/a/150079')
    expect(replace).toHaveReturnedWith('https://stackoverflow.com/a/160078')
  })
})
