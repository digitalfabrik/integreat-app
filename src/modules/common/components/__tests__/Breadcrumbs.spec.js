// @flow

import React from 'react'
import { shallow } from 'enzyme'

import Breadcrumbs from '../Breadcrumbs'
import BreadcrumbModel from '../../BreadcrumbModel'

describe('Breadcrumbs', () => {
  it('should render and match snapshot', () => {
    const wrapper = shallow(
      <Breadcrumbs direction='rtl' breadcrumbs={[
        new BreadcrumbModel({ title: 'Home', link: '/', node: <a href='/'>Home</a> }),
        new BreadcrumbModel({ title: 'Subcategory', link: '/sub', node: <a href='/sub'>Subcategory</a> }),
        new BreadcrumbModel({ title: 'ThisSite', link: '/sub/current', node: <a href='/sub/current'>ThisSite</a> }),
      ]} />)

    expect(wrapper).toMatchSnapshot()
  })
})
