// @flow

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
import { WOHNEN_ROUTE } from '../../../app/routes/wohnen'
import { SPRUNGBRETT_ROUTE } from '../../../app/routes/sprungbrett'

describe('LocationHeader', () => {
  const languages = [
    new LanguageModel('de', 'Deutsch'),
    new LanguageModel('en', 'English'),
    new LanguageModel('ar', 'Arabic')
  ]
  const t = (key: ?string): string => key || ''

  const events = [
    new EventModel({
      id: 1,
      path: '/augsburg/en/events/first_event',
      title: 'first Event',
      availableLanguages: new Map(
        [['de', '/augsburg/de/events/erstes_event'], ['ar', '/augsburg/ar/events/erstes_event']]),
      startDate: moment.tz('2017-11-18 09:30:00', 'UTC'),
      endDate: moment.tz('2017-11-18 19:30:00', 'UTC'),
      allDay: true,
      address: 'address',
      content: 'content',
      excerpt: 'excerpt',
      thumbnail: 'thumbnail',
      town: 'town'
    }),
    new EventModel({
      id: 2,
      path: '/augsburg/en/events/second_event',
      title: 'second Event',
      availableLanguages: new Map(
        [['en', '/augsburg/de/events/zwotes_event'], ['ar', '/augsburg/ar/events/zwotes_event']]),
      startDate: moment.tz('2017-11-18 09:30:00', 'UTC'),
      endDate: moment.tz('2017-11-18 19:30:00', 'UTC'),
      allDay: true,
      address: 'address',
      content: 'content',
      excerpt: 'excerpt',
      thumbnail: 'thumbnail',
      town: 'town'
    }),
    new EventModel({
      id: 3,
      path: '/augsburg/en/events/third_event',
      title: 'third Event',
      availableLanguages: new Map(
        [['de', '/augsburg/de/events/drittes_event'], ['ar', '/augsburg/ar/events/erstes_event']]),
      startDate: moment.tz('2017-11-18 09:30:00', 'UTC'),
      endDate: moment.tz('2017-11-18 19:30:00', 'UTC'),
      allDay: true,
      address: 'address',
      content: 'content',
      excerpt: 'excerpt',
      thumbnail: 'thumbnail',
      town: 'town'
    })
  ]

  const language = 'de'
  const city = 'augsburg'
  const location = route => ({type: route, payload: {city, language}})
  const onStickyTopChanged = (value: number) => {}

  describe('NavigationItems', () => {
    it('should be empty, if extras and news are both disabled', () => {
      const component = shallow(<LocationHeader location={location(CATEGORIES_ROUTE)}
                                                isExtrasEnabled={false}
                                                isEventsEnabled={false}
                                                viewportSmall
                                                events={events}
                                                onStickyTopChanged={onStickyTopChanged}
                                                t={t} />)
      expect(component.instance().getNavigationItems()).toMatchSnapshot()
    })

    it('should show categories, if extras or news are enabled', () => {
      const extrasComp = shallow(<LocationHeader location={location(CATEGORIES_ROUTE)}
                                                 isExtrasEnabled
                                                 isEventsEnabled={false}
                                                 viewportSmall
                                                 events={events}
                                                 onStickyTopChanged={onStickyTopChanged}
                                                 t={t} />)
      const eventsComp = shallow(<LocationHeader location={location(CATEGORIES_ROUTE)}
                                                 isExtrasEnabled={false}
                                                 isEventsEnabled
                                                 viewportSmall
                                                 events={events}
                                                 onStickyTopChanged={onStickyTopChanged}
                                                 t={t} />)

      expect(extrasComp.instance().getNavigationItems()).toMatchSnapshot()
      expect(eventsComp.instance().getNavigationItems()).toMatchSnapshot()
    })

    it('should show extras, categories, events in this order', () => {
      const component = shallow(<LocationHeader location={location(CATEGORIES_ROUTE)}
                                                isExtrasEnabled
                                                isEventsEnabled
                                                viewportSmall
                                                events={events}
                                                onStickyTopChanged={onStickyTopChanged}
                                                t={t} />)
      expect(component.instance().getNavigationItems()).toMatchSnapshot()
    })

    it('should highlight categories if route corresponds', () => {
      const component = shallow(<LocationHeader location={location(CATEGORIES_ROUTE)}
                                                isExtrasEnabled
                                                isEventsEnabled
                                                viewportSmall
                                                events={events}
                                                onStickyTopChanged={onStickyTopChanged}
                                                t={t} />)
      expect(component.instance().getNavigationItems()[1].props.selected).toBe(true)
    })

    it('should highlight events if route corresponds', () => {
      const component = shallow(<LocationHeader location={location(EVENTS_ROUTE)}
                                                isExtrasEnabled
                                                isEventsEnabled
                                                viewportSmall
                                                events={events}
                                                onStickyTopChanged={onStickyTopChanged}
                                                t={t} />)
      expect(component.instance().getNavigationItems()[2].props.selected).toBe(true)
    })

    it('should highlight extras if extras route is selected', () => {
      const component = shallow(<LocationHeader location={location(EXTRAS_ROUTE)}
                                                isExtrasEnabled
                                                isEventsEnabled
                                                viewportSmall
                                                events={events}
                                                onStickyTopChanged={onStickyTopChanged}
                                                t={t} />)
      expect(component.instance().getNavigationItems()[0].props.selected).toBe(true)
    })

    it('should highlight extras if sprungbrett route is selected', () => {
      const component = shallow(<LocationHeader location={location(SPRUNGBRETT_ROUTE)}
                                                isExtrasEnabled
                                                isEventsEnabled
                                                viewportSmall
                                                events={events}
                                                onStickyTopChanged={onStickyTopChanged}
                                                t={t} />)
      expect(component.instance().getNavigationItems()[0].props.selected).toBe(true)
    })

    it('should highlight extras if wohnen route is selected', () => {
      const component = shallow(<LocationHeader location={location(WOHNEN_ROUTE)}
                                                isExtrasEnabled
                                                isEventsEnabled
                                                viewportSmall
                                                events={events}
                                                onStickyTopChanged={onStickyTopChanged}
                                                t={t} />)
      expect(component.instance().getNavigationItems()[0].props.selected).toBe(true)
    })
  })

  describe('ActionItems', () => {
    it('should match snapshot', () => {
      const component = shallow(<LocationHeader location={location(EXTRAS_ROUTE)}
                                                isExtrasEnabled
                                                isEventsEnabled
                                                viewportSmall
                                                events={events}
                                                onStickyTopChanged={onStickyTopChanged}
                                                t={t} />)

      expect(component.instance().getActionItems()).toMatchSnapshot()
    })
  })

  it('should match snapshot', () => {
    const component = shallow(<LocationHeader location={location(EXTRAS_ROUTE)}
                                              isExtrasEnabled
                                              isEventsEnabled
                                              viewportSmall
                                              events={events}
                                              onStickyTopChanged={onStickyTopChanged}
                                              t={t} />)
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
      <ConnectedLocationHeader store={store} onStickyTopChanged={onStickyTopChanged} />
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
