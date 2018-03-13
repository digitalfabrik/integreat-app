import { shallow } from 'enzyme'
import React from 'react'
import LocationFooter from '../LocationFooter'
import Route from '../../../app/Route'

describe('LocationFooter', () => {
  it('should match snapshot', () => {
    const matchRoute = id => new Route({id, path: '/:location/:language/disclaimer'})

    const component = shallow(<LocationFooter location={'augsburg'} language={'de'}
                                              matchRoute={matchRoute} />)
    expect(component.dive()).toMatchSnapshot()
  })
})
