import React from 'react'
import { shallow } from 'enzyme'

import HeaderActionItem from '../../HeaderActionItem'
import HeaderNavigationItem from '../HeaderNavigationItem'
import Header from '../Header'

describe('Header', () => {
  it('should match snapshot with smallViewport', () => {
    const component = shallow(
      <Header
        logoHref={{type: 'RANDOM_ROUTE'}}
        actionItems={[new HeaderActionItem({href: {type: 'RANDOM_ROUTE'}})]}
        navigationItems={
          <HeaderNavigationItem href={{type: 'ANOTHER_RANDOM_ROUTE'}} text='text1' active selected tooltip='tooltip1' />
        }
        viewportSmall />
    )
    expect(component).toMatchSnapshot()
  })

  it('should match snapshot with largeViewport', () => {
    const component = shallow(
      <Header
        logoHref={{type: 'RANDOM_ROUTE'}}
        actionItems={[new HeaderActionItem({href: {type: 'RANDOM_ROUTE'}})]}
        navigationItems={
          <HeaderNavigationItem href={{type: 'ANOTHER_RANDOM_ROUTE'}} text='text1' active selected tooltip='tooltip1' />
        }
        viewportSmall={false} />
    )
    expect(component).toMatchSnapshot()
  })
})
