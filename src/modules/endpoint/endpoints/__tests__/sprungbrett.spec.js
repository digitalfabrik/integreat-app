import sprungbrett from '../sprungbrett'
import SprungbrettModel from '../../models/SprungbrettJobModel'

jest.unmock('../sprungbrett')

describe('categories', () => {
  const sprungbrettJSON = {
    results: [{
      title: 'Praktikum Fachinformatiker',
      apprenticeship: '0',
      employment: '1',
      city: 'Augsburg',
      zip: 86161,
      url: 'some_random_url.de',
      thumbnail: 'https://cms.integreat-ap…/03/Hotline-150x150.png'
    }, {
      title: 'Praktikum Ingenieur',
      apprenticeship: '1',
      employment: '1',
      city: 'Augsburg',
      zip: 86161,
      url: 'some_not_random_url.de',
      thumbnail: 'https://cms.integreat-ap…/03/Hotline-150x150.png'
    }, {
      title: 'Praktikum Matefachverkäufer',
      apprenticeship: '1',
      employment: '0',
      city: 'Los Angeles',
      zip: 3847,
      url: 'the_key_to_eternal_life.de',
      thumbnail: 'https://cms.integreat-ap…/03/Hotline-150x150.png'
    }]
  }

  const sprungbrettModels = [
    new SprungbrettModel({
      id: 0,
      title: 'Praktikum Fachinformatiker',
      isApprenticeship: false,
      isEmployment: true,
      location: '86161 Augsburg',
      url: 'some_random_url.de'
    }),
    new SprungbrettModel({
      id: 1,
      title: 'Praktikum Ingenieur',
      isApprenticeship: true,
      isEmployment: true,
      location: '86161 Augsburg',
      url: 'some_not_random_url.de'
    }),
    new SprungbrettModel({
      id: 2,
      title: 'Praktikum Matefachverkäufer',
      isApprenticeship: true,
      isEmployment: false,
      location: '3847 Los Angeles',
      url: 'the_key_to_eternal_life.de'
    })
  ]

  const state = {sprungbrettUrl: {url: 'some_url'}}

  // todo update this
  it('should map router to url', () => {
    expect(sprungbrett.mapStateToUrl(state)).toEqual(
      'https://webnext.integreat-app.de/proxy/sprungbrett/app-search-internships?location=some_url'
    )
  })

  it('should map fetched data to models', () => {
    expect(sprungbrett.mapResponse(sprungbrettJSON, state)).toEqual(sprungbrettModels)
  })
})
