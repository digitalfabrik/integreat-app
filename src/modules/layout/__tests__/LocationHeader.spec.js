import { shallow } from 'enzyme'
import React from 'react'
import Navigation from '../../app/Navigation'
import LocationHeader from '../components/LocationHeader'
import LocationModel from 'modules/endpoint/models/LocationModel'

describe('LocationHeader', () => {
  const navigation = new Navigation('location1', 'language1')
  const createLocation = (extrasEnabled, eventsEnabled) => new LocationModel({
    name: 'Mambo Nr. 5',
    code: 'location1',
    eventsEnabled,
    extrasEnabled
  })

  describe('MenuItems', () => {
    test('should be empty, if extras and news are both disabled', () => {
      const component = shallow(<LocationHeader navigation={navigation} location={createLocation(false, false)}
                                                route='' />)
      expect(component.dive().prop('menuItems')).toMatchSnapshot()
    })

    test('should show categories, if extras or news are enabled', () => {
      const extrasComp = shallow(<LocationHeader navigation={navigation} location={createLocation(true, false)}
                                                 route='' />)
      const eventsComp = shallow(<LocationHeader navigation={navigation} location={createLocation(false, true)}
                                                 route='' />)

      expect(extrasComp.dive().prop('menuItems')).toMatchSnapshot()
      expect(eventsComp.dive().prop('menuItems')).toMatchSnapshot()
    })

    test('should show extras, categories, events in this order', () => {
      const component = shallow(<LocationHeader navigation={navigation} location={createLocation(true, true)}
                                                route='' />)
      expect(component.dive().prop('menuItems')).toMatchSnapshot()
    })

    test('should highlight categories if route corresponds', () => {
      const route1Component = shallow(<LocationHeader navigation={navigation} location={createLocation(true, true)}
                                                      route='/:location/:language' />)
      const route2Component = shallow(<LocationHeader navigation={navigation} location={createLocation(true, true)}
                                                      route='/:location/:language/*' />)
      expect(route1Component.dive().prop('menuItems')).toMatchSnapshot()
      expect(route2Component.dive().prop('menuItems')).toEqual(route1Component.dive().prop('menuItems'))
    })

    test('should highlight events if route corresponds', () => {
      const component = shallow(<LocationHeader navigation={navigation} location={createLocation(true, true)}
                                                route='/:location/:language/events(/:id)' />)

      expect(component.dive().prop('menuItems')).toMatchSnapshot()
    })

    // todo for WEBAPP-64: should highlight extras if route corresponds
  })

  test('should match snapshot', () => {
    const component = shallow(<LocationHeader navigation={navigation} location={createLocation(true, true)} route='' />)
    expect(component.dive()).toMatchSnapshot()
  })
})
