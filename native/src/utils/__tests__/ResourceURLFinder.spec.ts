import { DateTime } from 'luxon'

import { ExtendedPageModel } from 'shared/api'

import ResourceURLFinder from '../ResourceURLFinder'

jest.mock('react-i18next')

describe('ResourceURLFinder', () => {
  it('should find urls ending on png, jpg, jpeg, pdf in src and href tags', () => {
    const finder = new ResourceURLFinder(['ex.am'])
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
      <img src="https://ex.am/noextension" alt="Nöp!" />
      <img src="https://ev.il/pl2.jpg" alt="Bööööse!" />
      <img src="invalid-url" alt="Näp!" />
    `)
    finder.finalize()
    expect(urls).toEqual(
      new Set([
        'https://ex.am/pl1.png',
        'https://ex.am/pl1.jpg',
        'https://ex.am/pl1.jpeg',
        'https://ex.am/pl1.pdf',
        'https://ex.am/pl2.png',
        'https://ex.am/pl2.jpg',
        'https://ex.am/pl2.jpeg',
        'https://ex.am/pl2.pdf',
      ]),
    )
  })

  it('should build a fetchMap including thumbnails if supplied', () => {
    const finder = new ResourceURLFinder(['ex.am'])
    finder.init()
    const input = [
      new ExtendedPageModel({
        path: '/path1',
        thumbnail: 'https://ex.am/thumb.png',
        content: `<img src="https://ex.am/pl1.png" alt="Crazy" />
                  <img src="https://ex.am/noextension" alt="Nöp!" />
                  <img src="invalid-url" alt="Näp!" />`,
        availableLanguages: {},
        title: 'test',
        lastUpdate: DateTime.now(),
      }),
      new ExtendedPageModel({
        path: '/path2',
        thumbnail: '',
        content: '<img src="https://ex.am/pl2.png" alt="Crazy" />',
        availableLanguages: {},
        title: 'test',
        lastUpdate: DateTime.now(),
      }),
    ]
    const fetchMap = finder.buildFetchMap(input, (url, urlHash) => `buildFilePath('${url}', '${urlHash}')`, [])
    finder.finalize()
    expect(fetchMap).toMatchSnapshot()
  })

  it('should build a correct fetch map using previously cached files', () => {
    const finder = new ResourceURLFinder(['ex.am'])
    finder.init()
    const input = [
      new ExtendedPageModel({
        path: '/path1',
        thumbnail: 'https://ex.am/thumb.png',
        content: `<img src="https://ex.am/pl1.png" alt="First Pic" />
                  <img src="https://ex.am/pl2.png" alt="Second Pic" />
                  <img src="https://ex.am/pl3.jpg" alt="Third Pic" />`,
        availableLanguages: {},
        title: 'test',
        lastUpdate: DateTime.now(),
      }),
      new ExtendedPageModel({
        path: '/path2',
        thumbnail: '',
        content: '<img src="https://ex.am/pl4.pdf" alt="And an entire PDF" />',
        availableLanguages: {},
        title: 'test',
        lastUpdate: DateTime.now(),
      }),
    ]
    const fetchMap = finder.buildFetchMap(input, (url, urlHash) => `buildFilePath('${url}', '${urlHash}')`, [
      'https://ex.am/pl2.png',
      'https://ex.am/pl4.pdf',
    ])
    finder.finalize()
    expect(fetchMap).toMatchSnapshot()
  })
})
