// @flow

import LocationModel from '../LocationModel'

describe('LocationModel', () => {
  it('should include the name if available', () => {
    const location = new LocationModel({
      name: 'Café Tür an Tür',
      address: 'Wertachstr. 29',
      town: 'Augsburg',
      state: 'Bavaria',
      postcode: '86353',
      region: 'Schwaben',
      country: 'DE'
    })
    expect(location.location).toEqual('Café Tür an Tür, Wertachstr. 29, 86353 Augsburg')
  })

  it('should exclude the name if unavailable', () => {
    const location = new LocationModel({
      name: null,
      address: 'Wertachstr. 29',
      town: 'Augsburg',
      state: 'Bavaria',
      postcode: '86353',
      region: 'Schwaben',
      country: 'DE'
    })
    expect(location.location).toEqual('Wertachstr. 29, 86353 Augsburg')
  })
})
