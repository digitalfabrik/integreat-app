import locationsMapper from '../locations'
import LocationModel from '../../models/LocationModel'

jest.unmock('../locations')

describe('locations', () => {
  const location1 = {
    name: 'Augsburg',
    path: '/augsburg/',
    live: true,
    'ige-evts': '1'
  }
  const location2 = {
    name: 'Stadt Regensburg',
    path: '/regensburg/',
    live: true,
    'ige-evts': '0'
  }
  const locationJson = [location1, location2]

  it('should map fetched data to models', () => {
    const locationModels = locationsMapper(locationJson)
    expect(locationModels).toEqual([
      new LocationModel({
        name: location1.name,
        code: 'augsburg',
        live: location1.live,
        eventsEnabled: true,
        extrasEnabled: true
      }),
      new LocationModel({
        name: location2.name,
        code: 'regensburg',
        live: location2.live,
        eventsEnabled: false,
        extrasEnabled: true
      })
    ])
  })
})
