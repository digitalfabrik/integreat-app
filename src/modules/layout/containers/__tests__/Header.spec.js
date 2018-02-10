import React from 'react'
import { shallow, mount } from 'enzyme'
import configureMockStore from 'redux-mock-store'

import HeaderActionItem from '../../HeaderActionItem'
import HeaderNavigationItem from '../../HeaderNavigationItem'
import ConnectedHeader, { Header } from '../Header'
import { Provider } from 'react-redux'

const mockStore = configureMockStore()

describe('Header', () => {
  test('should match snapshot with smallViewport', () => {
    const component = shallow(
      <Header smallViewport
              actionItems={[new HeaderActionItem({href: '/action1'})]}
              navigationItems={[new HeaderNavigationItem({href: '/nav1'})]} />
    )
    expect(component).toMatchSnapshot()
  })

  test('should match snapshot with largeViewport', () => {
    const component = shallow(
      <Header smallViewport={false}
              actionItems={[new HeaderActionItem({href: '/action1'})]}
              navigationItems={[new HeaderNavigationItem({href: '/nav1'})]} />
    )
    expect(component).toMatchSnapshot()
  })

  test('should connect to the store', () => {
    const smallStore = mockStore({viewport: {is: { small: true }}})
    const smallComponent = mount(<Provider store={smallStore}>
        <ConnectedHeader />
    </Provider>)

    expect(smallComponent.find(Header).prop('smallViewport')).toBe(true)

    const largeStore = mockStore({viewport: {is: { small: false }}})
    const largeComponent = mount(<Provider store={largeStore}>
      <ConnectedHeader />
    </Provider>)
    expect(largeComponent.find(Header).prop('smallViewport')).toBe(false)
  })
})
