import React from 'react'
import { render, shallow, mount } from 'enzyme'
import Caption from '../Caption'

describe('Caption', () => {
  it('should render', () => {
    expect(shallow(<Caption title={'Test Title'} />)).toMatchSnapshot()
  })
})
