import { RegionModelBuilder } from 'shared/api'

import moveViewportToRegion from '../moveViewportToRegion'

describe('moveMapViewportToRegion', () => {
  const region = new RegionModelBuilder(1).build()[0]!

  it('should move map viewport to region', () => {
    expect(moveViewportToRegion(region, undefined)).toMatchSnapshot()
  })

  it('should set zoom', () => {
    expect(moveViewportToRegion(region, 13).zoom).toBe(13)
  })
})
