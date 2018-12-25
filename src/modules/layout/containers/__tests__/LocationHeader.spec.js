// @flow

import { shallow } from 'enzyme'
import React from 'react'
import { EventModel, DateModel, LocationModel } from '@integreat-app/integreat-api-client'
import { LocationHeader } from '../LocationHeader'
import { CATEGORIES_ROUTE } from '../../../app/route-configs/CategoriesRouteConfig'
import { EVENTS_ROUTE } from '../../../app/route-configs/EventsRouteConfig'
import { EXTRAS_ROUTE } from '../../../app/route-configs/ExtrasRouteConfig'
import moment from 'moment-timezone'
import { WOHNEN_ROUTE } from '../../../app/route-configs/WohnenRouteConfig'
import { SPRUNGBRETT_ROUTE } from '../../../app/route-configs/SprungbrettRouteConfig'
import createLocation from '../../../../createLocation'

describe('LocationHeader', () => {
  const t = (key: ?string): string => key || ''

  const languageChangePaths = [
    {code: 'de', name: 'Deutsch', path: '/augsburg/de'},
    {code: 'en', name: 'English', path: '/augsburg/en'}
  ]

  const events = [
    new EventModel({
      id: 1,
      path: '/augsburg/en/events/first_event',
      title: 'first Event',
      availableLanguages: new Map(
        [['de', '/augsburg/de/events/erstes_event'], ['ar', '/augsburg/ar/events/erstes_event']]),
      date: new DateModel({
        startDate: moment.tz('2017-11-18 09:30:00', 'UTC'),
        endDate: moment.tz('2017-11-18 19:30:00', 'UTC'),
        allDay: true
      }),
      location: new LocationModel({
        address: 'address',
        town: 'town',
        postcode: 'postcode'
      }),
      excerpt: 'excerpt',
      lastUpdate: moment('2016-01-07 10:36:24'),
      content: 'content',
      thumbnail: 'thumbnail'
    }),
    new EventModel({
      id: 2,
      path: '/augsburg/en/events/second_event',
      title: 'second Event',
      availableLanguages: new Map(
        [['en', '/augsburg/de/events/zwotes_event'], ['ar', '/augsburg/ar/events/zwotes_event']]),
      date: new DateModel({
        startDate: moment.tz('2017-11-18 09:30:00', 'UTC'),
        endDate: moment.tz('2017-11-18 19:30:00', 'UTC'),
        allDay: true
      }),
      location: new LocationModel({
        address: 'address',
        town: 'town',
        postcode: 'postcode'
      }),
      content: 'content',
      excerpt: 'excerpt',
      lastUpdate: moment('2016-01-07 10:36:24'),
      thumbnail: 'thumbnail'
    }),
    new EventModel({
      id: 3,
      path: '/augsburg/en/events/third_event',
      title: 'third Event',
      availableLanguages: new Map(
        [['de', '/augsburg/de/events/drittes_event'], ['ar', '/augsburg/ar/events/erstes_event']]),
      date: new DateModel({
        startDate: moment.tz('2017-11-18 09:30:00', 'UTC'),
        endDate: moment.tz('2017-11-18 19:30:00', 'UTC'),
        allDay: true
      }),
      location: new LocationModel({
        address: 'address',
        town: 'town',
        postcode: 'postcode'
      }),
      content: 'content',
      excerpt: 'excerpt',
      lastUpdate: moment('2016-01-07 10:36:24'),
      thumbnail: 'thumbnail'
    })
  ]

  const language = 'de'
  const city = 'augsburg'
  const location = route => createLocation({type: route, payload: {city, language}})
  const onStickyTopChanged = (value: number) => {}

  describe('NavigationItems', () => {
    it('should be empty, if extras and news are both disabled', () => {
      const component = shallow(<LocationHeader location={location(CATEGORIES_ROUTE)}
                                                isExtrasEnabled={false}
                                                isEventsEnabled={false}
                                                viewportSmall
                                                events={events}
                                                languageChangePaths={languageChangePaths}
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
                                                 languageChangePaths={languageChangePaths}
                                                 onStickyTopChanged={onStickyTopChanged}
                                                 t={t} />)
      const eventsComp = shallow(<LocationHeader location={location(CATEGORIES_ROUTE)}
                                                 isExtrasEnabled={false}
                                                 isEventsEnabled
                                                 viewportSmall
                                                 events={events}
                                                 languageChangePaths={languageChangePaths}
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
                                                languageChangePaths={languageChangePaths}
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
                                                languageChangePaths={languageChangePaths}
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
                                                languageChangePaths={languageChangePaths}
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
                                                languageChangePaths={languageChangePaths}
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
                                                languageChangePaths={languageChangePaths}
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
                                                languageChangePaths={languageChangePaths}
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
                                                languageChangePaths={languageChangePaths}
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
                                              languageChangePaths={languageChangePaths}
                                              onStickyTopChanged={onStickyTopChanged}
                                              t={t} />)
    expect(component).toMatchSnapshot()
  })

  // fixme: Test the events enabled functionality. Especially isEventsActive()
})
