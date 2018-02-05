import { shallow } from 'enzyme'
import React from 'react'
import LocationFooter from '../LocationFooter'
import Route from '../../../app/Route'

describe('LocationFooter', () => {
  test('should match snapshot', () => {
    const component = shallow(<LocationFooter
      currentParams={{
        location: 'augsburg',
        language: 'de'
      }}
      matchRoute={(id) => new Route(id, '/:location/:language/disclaimer')} />)
    expect(component.dive()).toMatchSnapshot()
  })
})
