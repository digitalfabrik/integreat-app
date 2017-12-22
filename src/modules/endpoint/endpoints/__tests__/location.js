import location from '../location'
import LocationModel from '../../models/LocationModel'

describe('location', () => {
  const location1 = {
    id: '2',
    name: 'Augsburg',
    path: '/augsburg/',
    live: true,
    'ige-evts': '1'
  }
  const location2 = {
    id: '10',
    name: 'Stadt Regensburg',
    path: '/regensburg/',
    live: true,
    'ige-evts': '0'
  }
  const locationJson = [location1, location2]

  test('should map state to urls', () => {
    expect(location.mapStateToUrlParams({})).toEqual({})
  })

  test('should map fetched data to models', () => {
    const locationModels = location.mapResponse(locationJson)
    expect(locationModels).toEqual([
      new LocationModel({
        name: location1.name,
        code: 'augsburg',
        live: location1.live,
        eventsEnabled: true,
        extrasEnabled: true // todo: Adjust this in WEBAPP-64
      }),
      new LocationModel({
        name: location2.name,
        code: 'regensburg',
        live: location2.live,
        eventsEnabled: false,
        extrasEnabled: true // todo: Adjust this in WEBAPP-64
      })
    ])
  })
})
