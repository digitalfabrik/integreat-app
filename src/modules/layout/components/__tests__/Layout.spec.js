import Layout from '../Layout'
import React from 'react'
import { shallow } from 'enzyme'

describe('Layout', () => {
  it('should match snapshot', () => {
    const component = shallow(
      <Layout header={<header />} footer={<footer />}>Here comes the main content.</Layout>
    )
    expect(component).toMatchSnapshot()
  })
})
