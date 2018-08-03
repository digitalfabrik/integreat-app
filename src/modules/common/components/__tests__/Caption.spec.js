import React from 'react'
import Caption from '../Caption'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({adapter: new Adapter()})

describe('Caption', () => {
  it('should render', () => {
    expect(shallow(<Caption title={'Test Title'} />)).toMatchSnapshot()
  })
})
