import sprungbrett from '../sprungbrett'
import SprungbrettJobModel from '../../models/SprungbrettJobModel'
import ExtraModel from '../../models/ExtraModel'

jest.unmock('../sprungbrett')

describe('sprungbrett', () => {
  const json = {
    total: '19',
    pager: {current: 1, max: 1},
    results: [{
      title: 'Praktikum im Bereich Pflege',
      apprenticeship: '1',
      employment: '0',
      zip: '86150',
      city: 'Augsburg',
      lat: '48.364660',
      lon: '10.882451',
      distance: '1.223124064236733',
      url: 'some_url'
    },
    {
      title: 'Pflegefachhelfer/in Altenpflege',
      apprenticeship: '1',
      employment: '1',
      zip: '86150',
      city: 'Augsburg',
      lat: '48.364660',
      lon: '10.882451',
      distance: '1.223124064236733',
      url: 'some_other_url'
    },
    {
      title: 'Praktikum Maschinenbau',
      apprenticeship: '0',
      employment: '1',
      zip: '86150',
      city: 'Augsburg',
      lat: '48.364660',
      lon: '10.882451',
      distance: '1.223124064236733',
      url: 'some_third_url'
    }]
  }

  const sprungbrettJobModels = [
    new SprungbrettJobModel({
      id: 0,
      title: 'Praktikum im Bereich Pflege',
      location: '86150 Augsburg',
      url: 'some_url',
      isEmployment: false,
      isApprenticeship: true
    }),
    new SprungbrettJobModel({
      id: 1,
      title: 'Pflegefachhelfer/in Altenpflege',
      location: '86150 Augsburg',
      url: 'some_other_url',
      isEmployment: true,
      isApprenticeship: true
    }),
    new SprungbrettJobModel({
      id: 2,
      title: 'Praktikum Maschinenbau',
      location: '86150 Augsburg',
      url: 'some_third_url',
      isEmployment: true,
      isApprenticeship: false
    })
  ]

  const state = {extras: {data: [new ExtraModel({alias: 'sprungbrett', path: 'sprungbrett_url'})]}}

  it('should map router to url', () => {
    expect(sprungbrett.mapStateToUrl(state)).toEqual(
      'sprungbrett_url'
    )
  })

  it('should map fetched data to models', () => {
    const sprungbrettModel = sprungbrett.mapResponse(json)
    expect(sprungbrettModel).toEqual(sprungbrettJobModels)
  })
})
