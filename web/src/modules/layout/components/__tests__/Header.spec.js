// @flow

import React from 'react'
import { shallow } from 'enzyme'
import HeaderNavigationItem from '../HeaderNavigationItem'
import { Header } from '../Header'
import Headroom from '@integreat-app/react-sticky-headroom'
import Platform from '../../../platform/Platform'
import HeaderActionItemLink from '../HeaderActionItemLink'

describe('Header', () => {
  const onStickyTopChanged = (value: number) => undefined
  it('should match snapshot with smallViewport', () => {
    const component = shallow(
      <Header
        platform={new Platform()}
        logoHref='/random_route'
        actionItems={[<HeaderActionItemLink key={0} href='/random_route' text='random route' iconSrc='/icon.jpg' />]}
        onStickyTopChanged={onStickyTopChanged}
        navigationItems={[
          <HeaderNavigationItem key={0} href='/another_route' text='text1' icon='icon.jpg' active tooltip='tooltip1' />
        ]}
        viewportSmall />
    )
    expect(component).toMatchSnapshot()
  })

  it('should match snapshot with largeViewport', () => {
    const component = shallow(
      <Header
        platform={new Platform()}
        logoHref='/random_route'
        actionItems={[<HeaderActionItemLink key={0} href='/random_route' iconSrc='icon' text='text' />]}
        onStickyTopChanged={onStickyTopChanged}
        navigationItems={[
          <HeaderNavigationItem key={0} href='/another_route' icon='icon.jpg' text='text1' active tooltip='tooltip1' />
        ]}
        viewportSmall={false} />
    )
    expect(component).toMatchSnapshot()
  })

  it('should pass onStickyTopChanged to Headroom', () => {
    const callback = jest.fn()

    const component = shallow(
      <Header
        platform={new Platform()}
        logoHref='/random_route'
        actionItems={[<HeaderActionItemLink key={0} href='/random_route' iconSrc='icon.jpg' text='text' />]}
        navigationItems={[
          <HeaderNavigationItem key={0} href='/another_route' text='text1' icon='icon' active tooltip='tooltip1' />
        ]}
        viewportSmall={false}
        onStickyTopChanged={callback}
      />
    )

    component.find(Headroom).prop('onStickyTopChanged')(42)
    expect(callback).toHaveBeenCalledWith(42)
  })
})
