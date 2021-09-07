import { shallow } from 'enzyme'
import React from 'react'

import Headroom from '@integreat-app/react-sticky-headroom'

import { Header } from '../Header'
import HeaderActionItemLink from '../HeaderActionItemLink'
import HeaderNavigationItem from '../HeaderNavigationItem'

describe('Header', () => {
  const onStickyTopChanged = () => undefined

  it('should match snapshot with smallViewport', () => {
    const component = shallow(
      <Header
        logoHref='/random_route'
        actionItems={[<HeaderActionItemLink key={0} href='/random_route' text='random route' iconSrc='/icon.jpg' />]}
        onStickyTopChanged={onStickyTopChanged}
        navigationItems={[<HeaderNavigationItem key={0} href='/another_route' text='text1' icon='icon.jpg' active />]}
        viewportSmall
      />
    )
    expect(component).toMatchSnapshot()
  })

  it('should match snapshot with largeViewport', () => {
    const component = shallow(
      <Header
        logoHref='/random_route'
        actionItems={[<HeaderActionItemLink key={0} href='/random_route' iconSrc='icon' text='text' />]}
        onStickyTopChanged={onStickyTopChanged}
        navigationItems={[<HeaderNavigationItem key={0} href='/another_route' icon='icon.jpg' text='text1' active />]}
        viewportSmall={false}
      />
    )
    expect(component).toMatchSnapshot()
  })

  it('should pass onStickyTopChanged to Headroom', () => {
    const callback = jest.fn()

    const component = shallow(
      <Header
        logoHref='/random_route'
        actionItems={[<HeaderActionItemLink key={0} href='/random_route' iconSrc='icon.jpg' text='text' />]}
        navigationItems={[<HeaderNavigationItem key={0} href='/another_route' text='text1' icon='icon' active />]}
        viewportSmall={false}
        onStickyTopChanged={callback}
      />
    )

    const prop: (stickyTop: number) => void = component.find(Headroom).prop('onStickyTopChanged')!
    prop(42)
    expect(callback).toHaveBeenCalledWith(42)
  })
})
