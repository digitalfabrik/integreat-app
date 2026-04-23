import { CityModelBuilder } from 'shared/api'

import moveViewportToRegion from '../moveViewportToRegion'

describe('moveMapViewportToCity', () => {
  const city = new CityModelBuilder(1).build()[0]!

  it('should move map viewport to city', () => {
    expect(moveViewportToRegion(city, undefined)).toMatchSnapshot()
  })

  it('should set zoom', () => {
    expect(moveViewportToRegion(city, 13).zoom).toBe(13)
  })
})
