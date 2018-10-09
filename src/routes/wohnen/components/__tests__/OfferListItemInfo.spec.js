// @flow

import { shallow } from 'enzyme'
import React from 'react'
import OfferListItemInfo from '../OfferListItemInfo'

describe('OfferListItemInfo', () => {
  const totalArea = 120
  const totalRooms = 4
  const baseRent = 1000

  it('should render offer item', () => {
    const offerDetail = shallow(
      <OfferListItemInfo totalArea={totalArea} totalRooms={totalRooms} baseRent={baseRent} />
    )
    expect(offerDetail).toMatchSnapshot()
  })
})
