import React from 'react'
import { shallow } from 'enzyme'
import ExtraModel from '../../../../modules/endpoint/models/ExtraModel'
import SprungbrettListItem from '../SprungbrettListItem'

describe('SprungbrettListItem', () => {
  const extra = new ExtraModel({type: 'ige-ipb', path: 'praktikumsboerse', name: 'IHK PB', thumbnail: 'xy'})

  it('should match snapshot', () => {
    const wrapper = shallow(<SprungbrettListItem job={extra} />)
    expect(wrapper).toMatchSnapshot()
  })
})
