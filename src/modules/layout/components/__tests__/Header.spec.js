import React from 'react'
import { shallow } from 'enzyme'

import HeaderActionItem from '../../HeaderActionItem'
import HeaderNavigationItem from '../HeaderNavigationItem'
import Header from '../Header'
import theme from '../../../app/constants/theme'
import Headroom from '../../../common/components/Headroom'

describe('Header', () => {
  it('should match snapshot with smallViewport', () => {
    const component = shallow(
      <Header
        theme={theme}
        logoHref={{type: 'RANDOM_ROUTE'}}
        actionItems={[new HeaderActionItem({href: {type: 'RANDOM_ROUTE'}})]}
        navigationItems={
          <HeaderNavigationItem href={{type: 'ANOTHER_RANDOM_ROUTE'}} text='text1' active selected tooltip='tooltip1' />
        }
        viewportSmall />
    )
    expect(component.dive()).toMatchSnapshot()
  })

  it('should match snapshot with largeViewport', () => {
    const component = shallow(
      <Header
        theme={theme}
        logoHref={{type: 'RANDOM_ROUTE'}}
        actionItems={[new HeaderActionItem({href: {type: 'RANDOM_ROUTE'}})]}
        navigationItems={
          <HeaderNavigationItem href={{type: 'ANOTHER_RANDOM_ROUTE'}} text='text1' active selected tooltip='tooltip1' />
        }
        viewportSmall={false} />
    )
    expect(component.dive()).toMatchSnapshot()
  })

  it('should pass onStickyTopChanged to Headroom', () => {
    const callback = jest.fn()

    const component = shallow(
      <Header
        theme={theme}
        logoHref={{type: 'RANDOM_ROUTE'}}
        actionItems={[new HeaderActionItem({href: {type: 'RANDOM_ROUTE'}})]}
        navigationItems={
          <HeaderNavigationItem href={{type: 'ANOTHER_RANDOM_ROUTE'}} text='text1' active selected tooltip='tooltip1' />
        }
        viewportSmall={false}
        onStickyTopChanged={callback}
        />
    ).dive()

    component.find(Headroom).prop('onStickyTopChanged')(42)
    expect(callback).toHaveBeenCalledWith(42)
  })
})
