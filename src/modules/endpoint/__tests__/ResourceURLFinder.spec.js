// @flow

import ResourceURLFinder from '../ResourceURLFinder'

describe('ResourceURLFinder', () => {
  it('should find urls ending on png,jpg,jpeg,pdf in src and href tags', () => {
    const finder = new ResourceURLFinder()
    finder.init()
    const urls = finder.findResourceUrls(`
      <a href="https://ex.am/pl1.pdf.exe">Runterladen und zweimal klicken, um pdf zu öffnen</a>
      <a href="https://ex.am/pl1.png">Hier ne nice png (transparent und so)</a>
      <a href="https://ex.am/pl1.jpg">Hier 1 jpg</a>
      <a href="https://ex.am/pl1.jpeg">Das gleiche mit e</a>
      <a href="https://ex.am/pl1.pdf">Crazy Pdf mit Minigame und allem DrumUndDran!</a>
      
      <img src="https://ex.am/pl2.pdf.exe" alt="Krass!" />
      <img src="https://ex.am/pl2.png" alt="Wow!" />
      <img src="https://ex.am/pl2.jpg" alt="Ultra!" />
      <img src="https://ex.am/pl2.jpeg" alt="Meeeeega!" />
      <img src="https://ex.am/pl2.pdf" alt="Exorbitant!" />
    `)
    finder.finalize()

    expect(urls).toEqual(new Set([
      'https://ex.am/pl1.png',
      'https://ex.am/pl1.jpg',
      'https://ex.am/pl1.jpeg',
      'https://ex.am/pl1.pdf',
      'https://ex.am/pl2.png',
      'https://ex.am/pl2.jpg',
      'https://ex.am/pl2.jpeg',
      'https://ex.am/pl2.pdf'
    ]))
  })

  it('should build a fetchMap including thumbnails if supplied', () => {
    const finder = new ResourceURLFinder()
    finder.init()
    const input = [
      {
        path: '/path1',
        thumbnail: 'https://ex.am/thumb.png',
        content: `<img src="https://ex.am/pl1.png" alt="Crazy" />`
      },
      { path: '/path2', thumbnail: '', content: `<img src="https://ex.am/pl2.png" alt="Crazy" />` }
    ]
    const fetchMap = finder.buildFetchMap(input, (url, path) => `buildFilePath('${url}', '${path}')`)
    finder.finalize()

    expect(fetchMap).toMatchSnapshot()
  })
})
