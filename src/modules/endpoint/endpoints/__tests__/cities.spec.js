import cities from '../cities'
import CityModel from '../../models/CityModel'

jest.unmock('../cities')

describe('cities', () => {
  const city1 = {
    name: 'Augsburg',
    path: '/augsburg/',
    live: true,
    events: true,
    extras: true
  }
  const city2 = {
    name: 'Stadt Regensburg',
    path: '/regensburg/',
    live: true,
    events: false,
    extras: false
  }
  const cityJson = [city1, city2]

  it('should map router to url', () => {
    expect(cities.mapParamsToUrl()).toEqual('https://cms.integreat-app.de/wp-json/extensions/v3/sites')
  })

  it('should map fetched data to models', () => {
    const cityModels = cities.mapResponse(cityJson)
    expect(cityModels).toEqual([
      new CityModel({
        name: city1.name,
        code: 'augsburg',
        live: city1.live,
        eventsEnabled: true,
        extrasEnabled: true
      }),
      new CityModel({
        name: city2.name,
        code: 'regensburg',
        live: city2.live,
        eventsEnabled: false,
        extrasEnabled: false
      })
    ])
  })
})
