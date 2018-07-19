import React from 'react'
import { shallow } from 'enzyme'
import OfferList from '../OfferList'
import SprungbrettJobModel from '../../../../modules/endpoint/models/SprungbrettJobModel'

describe('OfferList', () => {
  const jobs = [
    new SprungbrettJobModel({
      id: '0', title: 'WebDeveloper', location: 'Augsburg', isEmployment: true, isApprenticeship: true
    }),
    new SprungbrettJobModel({
      id: '1', title: 'BackendDeveloper', location: 'Augsburg', isEmployment: true, isApprenticeship: false
    }),
    new SprungbrettJobModel({
      id: '2', title: 'Freelancer', location: 'Augsburg', isEmployment: false, isApprenticeship: true
    })
  ]

  it('should match snapshot', () => {
    const wrapper = shallow(<OfferList jobs={jobs} title={'Sprungbrett'} />)
    expect(wrapper).toMatchSnapshot()
  })
})
