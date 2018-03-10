import extrasMapper from '../extras'
import ExtraModel from '../../models/ExtraModel'

jest.unmock('../extras')

describe('extras', () => {
  const pageJson = [
    {
      name: 'Serlo ABC',
      alias: 'serlo-abc',
      url: 'https://abc-app.serlo.org/',
      post: null,
      thumbnail: 'some_thumbnail'
    },
    {
      name: 'Sprungbrett',
      alias: 'sprungbrett',
      url: 'https://web.integreat-app.de/proxy/sprungbrett/app-search-internships?location=augsburg',
      post: null,
      thumbnail: 'some_other_thumbnail'
    }]

  const extraModels = [
    new ExtraModel({
      alias: 'serlo-abc',
      thumbnail: 'some_thumbnail',
      name: 'Serlo ABC',
      path: 'https://abc-app.serlo.org/'
    }),
    new ExtraModel({
      alias: 'sprungbrett',
      thumbnail: 'some_other_thumbnail',
      name: 'Sprungbrett',
      path: 'https://web.integreat-app.de/proxy/sprungbrett/app-search-internships?location=augsburg'})
  ]

  it('should map json to models', () => {
    const disclaimerModel = extrasMapper(pageJson)
    expect(disclaimerModel).toEqual(extraModels)
  })
})
