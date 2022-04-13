import { shallow } from 'enzyme'
import React from 'react'

import Layout from '../Layout'

describe('Layout', () => {
  it('should render all components', () => {
    const component = shallow(
      <Layout footer={<footer />} header={<header />} toolbar={<div>toolybar</div>}>
        <p>content right here</p>
      </Layout>
    )
    expect(component).toMatchSnapshot()
  })
})
