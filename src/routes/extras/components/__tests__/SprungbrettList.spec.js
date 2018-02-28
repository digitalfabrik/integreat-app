import React from 'react'
import { shallow } from 'enzyme'
import SprungbrettList from '../SprungbrettList'
import ExtraModel from '../../../../modules/endpoint/models/ExtraModel'

describe('SprungbrettList', () => {
  const extras = [
    new ExtraModel({type: 'ige-sbt', path: 'path to fetch jobs from', name: 'Sprungbrett', thumbnail: 'xy'}),
    new ExtraModel({type: 'ige-ilb', path: 'ihk-jobborese.com', name: 'Jobboerse', thumbnail: 'xy'}),
    new ExtraModel({type: 'ige-ipb', path: 'ihk-pratkitkumsboerse.com', name: 'Praktikumsboerse', thumbnail: 'xy'})
  ]
  it('should match snapshot', () => {
    const wrapper = shallow(<SprungbrettList jobs={extras} />)
    expect(wrapper).toMatchSnapshot()
  })
})
