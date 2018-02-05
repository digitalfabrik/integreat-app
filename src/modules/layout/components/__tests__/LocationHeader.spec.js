import { shallow } from 'enzyme'
import React from 'react'
import LocationHeader from '../LocationHeader'
import LocationModel from 'modules/endpoint/models/LocationModel'
import Route from '../../../redux-little-router-config/Route'
import CategoriesPage from '../../../../routes/categories/containers/CategoriesPage'
import LandingPage from '../../../../routes/landing/containers/LandingPage'
import SearchPage from '../../../../routes/search/containers/SearchPage'
import EventsPage from '../../../../routes/events/containers/EventsPage'

describe('LocationHeader', () => {
  const matchRoute = (id) => {
    switch (id) {
      case CategoriesPage:
        return new Route(id, '/:location/:language(/*)')
      case LandingPage:
        return new Route(id, '/:language')
      case SearchPage:
        return new Route(id, '/:location/:language/search')
      case EventsPage:
        return new Route(id, '/:location/:language/events(/:id)')
    }
    throw new Error(`Route ${id} not found!`)
  }

  const currentParams = {
    location: 'augsburg',
    language: 'de'
  }

  const createLocation = (extrasEnabled, eventsEnabled) => new LocationModel({
    name: 'Mambo Nr. 5',
    code: 'location1',
    eventsEnabled,
    extrasEnabled
  })

  describe('NavigationItems', () => {
    test('should be empty, if extras and news are both disabled', () => {
      const component = shallow(<LocationHeader matchRoute={matchRoute} currentParams={currentParams}
                                                location={createLocation(false, false)}
                                                route='' />)
      expect(component.dive().prop('navigationItems')).toMatchSnapshot()
    })

    test('should show categories, if extras or news are enabled', () => {
      const extrasComp = shallow(<LocationHeader matchRoute={matchRoute} currentParams={currentParams}
                                                 location={createLocation(true, false)}
                                                 route='' />)
      const eventsComp = shallow(<LocationHeader matchRoute={matchRoute} currentParams={currentParams}
                                                 location={createLocation(false, true)}
                                                 route='' />)

      expect(extrasComp.dive().prop('navigationItems')).toMatchSnapshot()
      expect(eventsComp.dive().prop('navigationItems')).toMatchSnapshot()
    })

    test('should show extras, categories, events in this order', () => {
      const component = shallow(<LocationHeader matchRoute={matchRoute} currentParams={currentParams}
                                                location={createLocation(true, true)}
                                                route='' />)
      expect(component.dive().prop('navigationItems')).toMatchSnapshot()
    })

    test('should highlight categories if route corresponds', () => {
      const component = shallow(<LocationHeader matchRoute={matchRoute} currentParams={currentParams}
                                                      location={createLocation(true, true)}
                                                      route='/:location/:language(/*)' />)
      expect(component.dive().prop('navigationItems')).toMatchSnapshot()
    })

    test('should highlight events if route corresponds', () => {
      const component = shallow(<LocationHeader matchRoute={matchRoute} currentParams={currentParams}
                                                location={createLocation(true, true)}
                                                route='/:location/:language/events(/:id)' />)

      expect(component.dive().prop('navigationItems')).toMatchSnapshot()
    })

    // todo for WEBAPP-64: should highlight extras if route corresponds
  })

  test('should match snapshot', () => {
    const component = shallow(<LocationHeader matchRoute={matchRoute} currentParams={currentParams}
                                              location={createLocation(true, true)} route='' />)
    expect(component.dive()).toMatchSnapshot()
  })
})
