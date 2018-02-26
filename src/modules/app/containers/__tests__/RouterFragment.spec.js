import React from 'react'
import { mount, shallow } from 'enzyme/build/index'
import ConnectedRouterFragment, { RouterFragment } from '../RouterFragment'
import configureMockStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import RouteConfig from '../../RouteConfig'
import Route from '../../Route'

describe('RouterFragment', () => {
  it('should render', () => {
    shallow(<RouterFragment routeConfig={new RouteConfig()} scrollHeight={0} />)
  })

  it('should match routes and use route config', () => {
    const id = 0xBABE
    const route = new Route({id, path: '/'})
    const tree = shallow(<RouterFragment routeConfig={new RouteConfig([route])} scrollHeight={0} />)

    expect(tree.instance().matchRoute(id)).toBe(route)
  })

  it('should tell if string is a language code', () => {
    expect(RouterFragment.isLanguageCode('de')).toBe(true)
    expect(RouterFragment.isLanguageCode('1')).toBe(false)
    expect(RouterFragment.isLanguageCode('123')).toBe(false)
  })

  describe('connect()', () => {
    const mockStore = configureMockStore()

    const createComponentInViewport = small => {
      const routeConfig = new RouteConfig([])

      const smallStore = mockStore({
        viewport: {is: {small}},
        router: {params: {location: 'augsburg', language: 'en', id: '1234'}, route: '/:location/:language'}
      })
      return mount(
        <Provider store={smallStore}>
          <ConnectedRouterFragment routeConfig={routeConfig} />
        </Provider>
      )
    }

    it('should have correct scroll height', () => {
      const smallComponent = createComponentInViewport(true).find(ConnectedRouterFragment).childAt(0)
      expect(smallComponent.prop('viewportSmall')).toBe(true)

      const largeComponent = createComponentInViewport(false).find(ConnectedRouterFragment).childAt(0)
      expect(largeComponent.prop('viewportSmall')).toBe(false)
    })
  })
})
