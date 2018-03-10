import React from 'react'
import { shallow } from 'enzyme'
import LocationModel from 'modules/endpoint/models/LocationModel'

import EventModel from '../../../endpoint/models/EventModel'
import moment from 'moment-timezone'
import LanguageModel from '../../../endpoint/models/LanguageModel'
import { LocationLayout } from '../LocationLayout'

describe('LocationLayout', () => {
  const matchRoute = id => {}

  const language = 'de'

  const locations = [new LocationModel({name: 'Mambo No. 5', code: 'location1'})]

  const languages = [
    new LanguageModel('de', 'Deutsch'),
    new LanguageModel('en', 'English'),
    new LanguageModel('ar', 'Arabic')
  ]

  const events = [
    new EventModel({
      id: 1234,
      title: 'first Event',
      availableLanguages: {de: '1235', ar: '1236'},
      startDate: moment.tz('2017-11-18 09:30:00', 'UTC'),
      endDate: moment.tz('2017-11-18 19:30:00', 'UTC'),
      allDay: true
    }),
    new EventModel({
      id: 2,
      title: 'second Event',
      startDate: moment.tz('2017-11-18 09:30:00', 'UTC'),
      endDate: moment.tz('2017-11-18 19:30:00', 'UTC'),
      allDay: true
    })]

  const MockNode = () => <div />

  it('should show LocationHeader and LocationFooter if LocationModel is available', () => {
    const component = shallow(
      <LocationLayout location='location1'
                      language={language}
                      languages={languages}
                      matchRoute={matchRoute}
                      locations={locations}
                      viewportSmall
                      currentPath='/:location/:language'
                      events={events}>
        <MockNode />
      </LocationLayout>)
    expect(component).toMatchSnapshot()
  })

  it('should show GeneralHeader and GeneralFooter if LocationModel is not available', () => {
    const component = shallow(
      <LocationLayout location='unavailableLocation'
                      language={language}
                      languages={languages}
                      matchRoute={matchRoute}
                      locations={locations}
                      viewportSmall
                      currentPath='/:location/:language'
                      events={events}>
        <MockNode />
      </LocationLayout>)
    expect(component).toMatchSnapshot()
  })
/**
  describe('connect()', () => {
    const location = 'augsburg'
    const path = '/:location/:language'

    const store = createReduxStore(createHistory, {
      router: {params: {location: location, language: language}, route: path},
      viewport: {is: {small: true}}
    })

    it('should map state to props', () => {
      const tree = mount(
        <Provider store={store}>
          <ConnectedLocationLayout events={events} languages={languages} matchRoute={matchRoute} />
        </Provider>
      )

      expect(tree.find(LocationLayout).props()).toEqual({
        currentPath: path,
        location: location,
        language: language,
        locations: locations,
        viewportSmall: false,
        matchRoute: matchRoute,
        events: events,
        dispatch: expect.any(Function)
      })
    })

    it('should have correct scroll height', () => {
      const smallComponent = mount(
        <Provider store={createStoreWithViewport(true)}>
          <ConnectedLocationLayout locations={locations} languages={languages} matchRoute={matchRoute} />
        </Provider>
      ).find(LocationLayout)
      expect(smallComponent.prop('viewportSmall')).toBe(true)

      const largeComponent = mount(
        <Provider store={createStoreWithViewport(false)}>
          <ConnectedLocationLayout locations={locations} languages={languages} matchRoute={matchRoute} />
        </Provider>
      ).find(LocationLayout)
      expect(largeComponent.prop('viewportSmall')).toBe(false)
    })
  })
 */
})
