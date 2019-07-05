// @flow

import React from 'react'
import { shallow } from 'enzyme'

import HeaderActionItem from '../../HeaderActionItem'
import HeaderNavigationItem from '../HeaderNavigationItem'
import { Header } from '../Header'
import { darkTheme } from '../../../theme/constants/theme'
import Headroom from '@integreat-app/react-sticky-headroom'
import Platform from '../../../platform/Platform'

describe('Header', () => {
  const onStickyTopChanged = (value: number) => void
  it('should match snapshot with smallViewport', () => {
    const component = shallow(
      <Header
        theme={darkTheme}
        platform={new Platform()}
        logoHref={'/random_route'}
        actionItems={[new HeaderActionItem({href: '/random_route'})]}
        onStickyTopChanged={onStickyTopChanged}
        navigationItems={
          <HeaderNavigationItem href={'/another_route'} text='text1' active selected tooltip='tooltip1' />
        }
        viewportSmall />
    )
    expect(component).toMatchSnapshot()
  })

  it('should match snapshot with largeViewport', () => {
    const component = shallow(
      <Header
        theme={darkTheme}
        platform={new Platform()}
        logoHref={'/random_route'}
        actionItems={[new HeaderActionItem({href: '/random_route'})]}
        onStickyTopChanged={onStickyTopChanged}
        navigationItems={
          <HeaderNavigationItem href={'/another_route'} text='text1' active selected tooltip='tooltip1' />
        }
        viewportSmall={false} />
    )
    expect(component).toMatchSnapshot()
  })

  it('should pass onStickyTopChanged to Headroom', () => {
    const callback = jest.fn()

    const component = shallow(
      <Header
        theme={darkTheme}
        platform={new Platform()}
        logoHref={'/random_route'}
        actionItems={[new HeaderActionItem({href: '/random_route'})]}
        navigationItems={
          <HeaderNavigationItem href={'/another_route'} text='text1' active selected tooltip='tooltip1' />
        }
        viewportSmall={false}
        onStickyTopChanged={callback}
      />
    )

    component.find(Headroom).prop('onStickyTopChanged')(42)
    expect(callback).toHaveBeenCalledWith(42)
  })
})
