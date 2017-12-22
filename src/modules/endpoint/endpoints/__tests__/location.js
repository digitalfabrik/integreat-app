import location from '../location'

describe('location', () => {
  const locationJson = [
    {
      id: '2',
      name: 'Augsburg',
      path: '/augsburg/',
      description: 'Augsburg',
      live: true
    },
    {
      id: '10',
      name: 'Stadt Regensburg',
      path: '/regensburg/',
      description: 'Stadt Regensburg',
      live: true
    }]

  test('should map state to urls', () => {
    expect(location.mapStateToUrlParams({})).toEqual({})
  })

  test('should map fetched data to models', () => {
    const locationModels = location.mapResponse(locationJson)
    expect(locationModels).toEqual([])
  })
})
