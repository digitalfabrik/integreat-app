import React from 'react'
import { shallow } from 'enzyme'
import OfferListItem from '../OfferListItem'
import SprungbrettJobModel from '../../../../modules/endpoint/models/SprungbrettJobModel'

describe('OfferListItem', () => {
  const job = new SprungbrettJobModel({
    id: '0', title: 'WebDeveloper', location: 'Augsburg', isEmployment: true, isApprenticeship: true
  })
  it('should match snapshot', () => {
    const wrapper = shallow(<OfferListItem job={job} />)
    expect(wrapper).toMatchSnapshot()
  })
})
