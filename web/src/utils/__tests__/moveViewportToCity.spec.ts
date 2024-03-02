import { CityModelBuilder } from 'shared/api'

import moveViewportToCity from '../moveViewportToCity'

describe('moveMapViewportToCity', () => {
  const city = new CityModelBuilder(1).build()[0]!

  it('should move map viewport to city', () => {
    expect(moveViewportToCity(city, undefined)).toMatchSnapshot()
  })

  it('should set zoom', () => {
    expect(moveViewportToCity(city, 13).zoom).toBe(13)
  })
})
