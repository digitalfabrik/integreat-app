import React from 'react'
import HeaderActionItem from '../../HeaderActionItem'
import HeaderNavigationItem from '../../HeaderNavigationItem'
import Header from '../Header'
import { shallow } from 'enzyme'

describe('Header', () => {
  test('should match snapshot', () => {
    const component = shallow(
      <Header actionItems={[new HeaderActionItem({href: '/action1'})]}
              navigationItems={[new HeaderNavigationItem({href: '/nav1'})]} />
    )
    expect(component).toMatchSnapshot()
  })
})
