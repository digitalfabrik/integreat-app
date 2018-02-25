import React from 'react'
import { shallow } from 'enzyme'
import RouterFragment from '../containers/RouterFragment'
import RouteConfig from '../RouteConfig'
import Route from '../Route'

describe('RouterFragment', () => {
  it('should render', () => {
    shallow(<RouterFragment routeConfig={new RouteConfig()} />)
  })

  it('should match routes and use route config', () => {
    const id = 0xBABE
    const route = new Route({id, path: '/'})
    const tree = shallow(<RouterFragment routeConfig={new RouteConfig([route])} />)

    expect(tree.instance().matchRoute(id)).toBe(route)
  })

  it('should tell if string is a language code', () => {
    expect(RouterFragment.isLanguageCode('de')).toBe(true)
    expect(RouterFragment.isLanguageCode('1')).toBe(false)
    expect(RouterFragment.isLanguageCode('123')).toBe(false)
  })
})
