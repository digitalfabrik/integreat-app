import { shallow } from 'enzyme'
import React from 'react'
import ConnectedLocationHeader, { LocationHeader } from '../LocationHeader'
import LanguageModel from '../../../endpoint/models/LanguageModel'
import { CATEGORIES_ROUTE } from '../../../app/routes/categories'
import { EVENTS_ROUTE } from '../../../app/routes/events'
import { EXTRAS_ROUTE } from '../../../app/routes/extras'
import moment from 'moment-timezone'
import EventModel from '../../../endpoint/models/EventModel'
import configureMockStore from 'redux-mock-store'

describe('LocationHeader', () => {
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
      id: 1235,
      title: 'erstes Event',
      availableLanguages: {en: '1234', ar: '1236'},
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
    })
  ]

  const language = 'de'
  const city = 'augsburg'

  const location = route => ({type: route, payload: {city, language}})

  describe('NavigationItems', () => {
    it('should be empty, if extras and news are both disabled', () => {
      const component = shallow(<LocationHeader location={location(CATEGORIES_ROUTE)}
                                                languages={languages}
                                                isExtrasEnabled={false}
                                                isEventsEnabled={false}
                                                viewportSmall
                                                events={events}
                                                t={() => {}} />)
      expect(component.instance().getNavigationItems()).toMatchSnapshot()
    })

    it('should show categories, if extras or news are enabled', () => {
      const extrasComp = shallow(<LocationHeader location={location(CATEGORIES_ROUTE)}
                                                 languages={languages}
                                                 isExtrasEnabled
                                                 isEventsEnabled={false}
                                                 viewportSmall
                                                 events={events}
                                                 t={key => key} />)
      const eventsComp = shallow(<LocationHeader location={location(CATEGORIES_ROUTE)}
                                                 languages={languages}
                                                 isExtrasEnabled={false}
                                                 isEventsEnabled
                                                 viewportSmall
                                                 events={events}
                                                 t={key => key} />)

      expect(extrasComp.instance().getNavigationItems()).toMatchSnapshot()
      expect(eventsComp.instance().getNavigationItems()).toMatchSnapshot()
    })

    it('should show extras, categories, events in this order', () => {
      const component = shallow(<LocationHeader location={location(CATEGORIES_ROUTE)}
                                                languages={languages}
                                                isExtrasEnabled
                                                isEventsEnabled
                                                viewportSmall
                                                events={events}
                                                t={key => key} />)
      expect(component.instance().getNavigationItems()).toMatchSnapshot()
    })

    it('should highlight categories if route corresponds', () => {
      const component = shallow(<LocationHeader location={location(CATEGORIES_ROUTE)}
                                                languages={languages}
                                                isExtrasEnabled
                                                isEventsEnabled
                                                viewportSmall
                                                events={events}
                                                t={key => key} />)
      expect(component.instance().getNavigationItems()).toMatchSnapshot()
    })

    it('should highlight events if route corresponds', () => {
      const component = shallow(<LocationHeader location={location(EVENTS_ROUTE)}
                                                languages={languages}
                                                isExtrasEnabled
                                                isEventsEnabled
                                                viewportSmall
                                                events={events}
                                                t={key => key} />)
      expect(component.instance().getNavigationItems()).toMatchSnapshot()
    })

    it('should highlight extras if extras route is selected', () => {
      const component = shallow(<LocationHeader location={location(EXTRAS_ROUTE)}
                                                languages={languages}
                                                isExtrasEnabled
                                                isEventsEnabled
                                                viewportSmall
                                                events={events}
                                                t={key => key} />)
      expect(component.instance().getNavigationItems()).toMatchSnapshot()
    })
  })

  describe('ActionItems', () => {
    it('should match snapshot', () => {
      const component = shallow(<LocationHeader location={location(EXTRAS_ROUTE)}
                                                languages={languages}
                                                isExtrasEnabled
                                                isEventsEnabled
                                                viewportSmall
                                                events={events}
                                                t={key => key} />)

      expect(component.instance().getActionItems()).toMatchSnapshot()
    })
  })

  it('should match snapshot', () => {
    const component = shallow(<LocationHeader location={location(EXTRAS_ROUTE)}
                                              languages={languages}
                                              isExtrasEnabled
                                              isEventsEnabled
                                              viewportSmall
                                              events={events}
                                              t={key => key} />)
    expect(component).toMatchSnapshot()
  })

  it('should map state to props', () => {
    const mockStore = configureMockStore()
    const store = mockStore({
      location: location(CATEGORIES_ROUTE),
      events: {data: events},
      languages: {data: languages},
      viewport: {is: {small: false}}
    })

    const categoriesPage = shallow(
      <ConnectedLocationHeader store={store} />
    )

    expect(categoriesPage.props()).toMatchObject({
      location: location(CATEGORIES_ROUTE),
      languages,
      events,
      viewportSmall: false
    })
  })

  // fixme: Test the events enabled functionality. Especially isEventsActive()
})
