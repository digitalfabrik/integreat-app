import React from 'react'
import { shallow } from 'enzyme'
import SprungbrettListItem from '../SprungbrettListItem'
import SprungbrettJobModel from '../../../../modules/endpoint/models/SprungbrettJobModel'

describe('SprungbrettListItem', () => {
  const job = new SprungbrettJobModel({
    id: '0', title: 'WebDeveloper', location: 'Augsburg', isEmployment: true, isApprenticeship: true
  })
  it('should match snapshot', () => {
    const wrapper = shallow(<SprungbrettListItem job={job} />)
    expect(wrapper).toMatchSnapshot()
  })
})
