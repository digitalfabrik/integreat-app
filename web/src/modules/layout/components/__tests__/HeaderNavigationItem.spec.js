// @flow

import React from 'react'
import HeaderNavigationItem from '../HeaderNavigationItem'
import { shallow } from 'enzyme'

describe('HeaderNavigationItem', () => {
  const tooltip = 'random tooltip'
  const href = '/augsburg/de'
  const text = 'Kategorien'

  it('should render an ActiveNavigationItem', () => {
    const headerNavigationItem = shallow(<HeaderNavigationItem text={text} active href={href} icon='icon' />)

    expect(headerNavigationItem).toMatchSnapshot()
  })

  it('should render an InactiveNavigationItem', () => {
    const headerNavigationItem = shallow(
      <HeaderNavigationItem text={text} href={href} active={false} icon='icon' tooltip={tooltip} />
    )

    expect(headerNavigationItem).toMatchSnapshot()
  })
})
