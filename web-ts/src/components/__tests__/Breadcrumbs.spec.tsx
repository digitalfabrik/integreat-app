import React from 'react'
import { shallow } from 'enzyme'
import Breadcrumbs from '../Breadcrumbs'
import BreadcrumbModel from '../../models/BreadcrumbModel'

describe('Breadcrumbs', () => {
  it('should render and match snapshot', () => {
    const wrapper = shallow(
      <Breadcrumbs
        direction='rtl'
        ancestorBreadcrumbs={[
          new BreadcrumbModel({
            title: 'Home',
            link: 'https://abc.xyz/',
            node: <a href='/'>Home</a>
          }),
          new BreadcrumbModel({
            title: 'Subcategory',
            link: 'https://abc.xyz/sub',
            node: <a href='/sub'>Subcategory</a>
          })
        ]}
        currentBreadcrumb={
          new BreadcrumbModel({
            title: 'ThisSite',
            link: 'https://abc.xyz/sub/current',
            node: <a href='/sub/current'>ThisSite</a>
          })
        }
      />
    )
    expect(wrapper).toMatchSnapshot()
  })
})
