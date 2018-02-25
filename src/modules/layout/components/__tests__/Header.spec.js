import React from 'react'
import { shallow, mount } from 'enzyme'
import configureMockStore from 'redux-mock-store'

import HeaderActionItem from '../../HeaderActionItem'
import HeaderNavigationItem from '../../HeaderNavigationItem'
import Header from '../Header'
import { Provider } from 'react-redux'

const mockStore = configureMockStore()

describe('Header', () => {
  test('should match snapshot with smallViewport', () => {
    const component = shallow(
      <Header
        logoHref={'/'}
        actionItems={[new HeaderActionItem({href: '/action1'})]}
        navigationItems={[new HeaderNavigationItem({href: '/nav1'})]} />
    )
    expect(component).toMatchSnapshot()
  })

  test('should match snapshot with largeViewport', () => {
    const component = shallow(
      <Header
        logoHref={'/'}
        actionItems={[new HeaderActionItem({href: '/action1'})]}
        navigationItems={[new HeaderNavigationItem({href: '/nav1'})]} />
    )
    expect(component).toMatchSnapshot()
  })
})
