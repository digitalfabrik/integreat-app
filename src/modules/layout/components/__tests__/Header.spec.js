import React from 'react'
import { shallow } from 'enzyme'

import HeaderActionItem from '../../HeaderActionItem'
import HeaderNavigationItem from '../../HeaderNavigationItem'
import Header from '../Header'

describe('Header', () => {
  it('should match snapshot with smallViewport', () => {
    const component = shallow(
      <Header
        logoHref={'/'}
        actionItems={[new HeaderActionItem({href: '/action1'})]}
        navigationItems={[new HeaderNavigationItem({href: '/nav1'})]} />
    )
    expect(component).toMatchSnapshot()
  })

  it('should match snapshot with largeViewport', () => {
    const component = shallow(
      <Header
        logoHref={'/'}
        actionItems={[new HeaderActionItem({href: '/action1'})]}
        navigationItems={[new HeaderNavigationItem({href: '/nav1'})]} />
    )
    expect(component).toMatchSnapshot()
  })
})
