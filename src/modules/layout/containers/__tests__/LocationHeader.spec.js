import { shallow } from 'enzyme'
import React from 'react'
import LocationHeader from '../LocationHeader'
import LocationModel from 'modules/endpoint/models/LocationModel'
import Route from '../../../app/Route'
import { categoriesRoute, eventsRoute, extrasRoute, landingRoute, searchRoute } from '../../../app/createRouteConfig'

describe('LocationHeader', () => {
  const matchRoute = id => {
    switch (id) {
      case categoriesRoute:
        return new Route({id, path: '/:location/:language(/*)'})
      case landingRoute:
        return new Route({id, path: '/:language'})
      case searchRoute:
        return new Route({id, path: '/:location/:language/search'})
      case eventsRoute:
        return new Route({id, path: '/:location/:language/events(/:id)'})
      case extrasRoute:
        return new Route({id, path: '/:location/:language/extras(/:extra)'})
    }
    throw new Error(`Route ${id} not found!`)
  }

  const language = 'de'

  const createLocation = (extrasEnabled, eventsEnabled) => new LocationModel({
    name: 'Mambo Nr. 5',
    code: 'location1',
    eventsEnabled,
    extrasEnabled
  })

  describe('NavigationItems', () => {
    it('should be empty, if extras and news are both disabled', () => {
      const component = shallow(<LocationHeader matchRoute={matchRoute} language={language}
                                                locationModel={createLocation(false, false)}
                                                currentPath=''
                                                viewportSmall
                                                eventCount={0} />)
      expect(component.dive().prop('navigationItems')).toMatchSnapshot()
    })

    it('should show categories, if extras or news are enabled', () => {
      const extrasComp = shallow(<LocationHeader matchRoute={matchRoute} language={language}
                                                 locationModel={createLocation(true, false)}
                                                 currentPath=''
                                                 viewportSmall
                                                 eventCount={0} />)
      const eventsComp = shallow(<LocationHeader matchRoute={matchRoute} language={language}
                                                 locationModel={createLocation(false, true)}
                                                 currentPath=''
                                                 viewportSmall
                                                 eventCount={0} />)

      expect(extrasComp.dive().prop('navigationItems')).toMatchSnapshot()
      expect(eventsComp.dive().prop('navigationItems')).toMatchSnapshot()
    })

    it('should show extras, categories, events in this order', () => {
      const component = shallow(<LocationHeader matchRoute={matchRoute} language={language}
                                                locationModel={createLocation(true, true)}
                                                currentPath=''
                                                viewportSmall
                                                eventCount={0} />)
      expect(component.dive().prop('navigationItems')).toMatchSnapshot()
    })

    it('should highlight categories if route corresponds', () => {
      const component = shallow(<LocationHeader matchRoute={matchRoute} language={language}
                                                locationModel={createLocation(true, true)}
                                                currentPath='/:location/:language(/*)'
                                                viewportSmall
                                                eventCount={0} />)
      expect(component.dive().prop('navigationItems')).toMatchSnapshot()
    })

    it('should highlight events if route corresponds', () => {
      const component = shallow(<LocationHeader matchRoute={matchRoute} language={language}
                                                locationModel={createLocation(true, true)}
                                                currentPath='/:location/:language/events(/:id)'
                                                viewportSmall
                                                eventCount={0} />)

      expect(component.dive().prop('navigationItems')).toMatchSnapshot()
    })

    it('should highlight extras if extras route is selected', () => {
      const component = shallow(<LocationHeader matchRoute={matchRoute} language={language}
                                                locationModel={createLocation(true, true)}
                                                route='/:location/:language/extras(/:extra)'
                                                currentPath=''
                                                viewportSmall
                                                eventCount={0} />)

      expect(component.dive().prop('navigationItems')).toMatchSnapshot()
    })
  })

  it('should match snapshot', () => {
    const component = shallow(<LocationHeader matchRoute={matchRoute} language={language}
                                              locationModel={createLocation(true, true)}
                                              currentPath=''
                                              viewportSmall
                                              eventCount={0} />)
    expect(component.dive()).toMatchSnapshot()
  })

  // fixme: Test the events enabled functionality. Especially isEventsActive()
})
