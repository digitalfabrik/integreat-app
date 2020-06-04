// @flow

import { shallow } from 'enzyme'
import React from 'react'
import { DateModel, EventModel, LocationModel } from '@integreat-app/integreat-api-client'
import { LocationHeader } from '../LocationHeader'
import { CATEGORIES_ROUTE } from '../../../app/route-configs/CategoriesRouteConfig'
import { EVENTS_ROUTE } from '../../../app/route-configs/EventsRouteConfig'
import { EXTRAS_ROUTE } from '../../../app/route-configs/ExtrasRouteConfig'
import moment from 'moment'
import { WOHNEN_ROUTE } from '../../../app/route-configs/WohnenRouteConfig'
import { SPRUNGBRETT_ROUTE } from '../../../app/route-configs/SprungbrettRouteConfig'
import createLocation from '../../../../createLocation'

describe('LocationHeader', () => {
  const t = (key: ?string): string => key || ''

  const languageChangePaths = [
    { code: 'de', name: 'Deutsch', path: '/augsburg/de' },
    { code: 'en', name: 'English', path: '/augsburg/en' }
  ]

  const events = [
    new EventModel({
      hash: '35654fa',
      path: '/augsburg/en/events/first_event',
      title: 'first Event',
      availableLanguages: new Map(
        [['de', '/augsburg/de/events/erstes_event'], ['ar', '/augsburg/ar/events/erstes_event']]),
      date: new DateModel({
        startDate: moment('2017-11-18T09:30:00.000Z'),
        endDate: moment('2017-11-18T19:30:00.000Z'),
        allDay: true
      }),
      location: new LocationModel({
        name: 'name',
        address: 'address',
        town: 'town',
        postcode: 'postcode',
        longitude: null,
        latitude: null,
        state: 'state',
        region: 'region',
        country: 'country'
      }),
      excerpt: 'excerpt',
      lastUpdate: moment('2016-01-07 10:36:24'),
      content: 'content',
      thumbnail: 'thumbnail',
      featuredImage: null
    }),
    new EventModel({
      hash: '35654fff',
      path: '/augsburg/en/events/second_event',
      title: 'second Event',
      availableLanguages: new Map(
        [['en', '/augsburg/de/events/zwotes_event'], ['ar', '/augsburg/ar/events/zwotes_event']]),
      date: new DateModel({
        startDate: moment('2017-11-18T09:30:00.000Z'),
        endDate: moment('2017-11-18T19:30:00.000Z'),
        allDay: true
      }),
      location: new LocationModel({
        name: 'name',
        address: 'address',
        town: 'town',
        postcode: 'postcode',
        longitude: null,
        latitude: null,
        state: 'state',
        region: 'region',
        country: 'country'
      }),
      content: 'content',
      excerpt: 'excerpt',
      lastUpdate: moment('2016-01-07 10:36:24'),
      thumbnail: 'thumbnail',
      featuredImage: null
    }),
    new EventModel({
      hash: '23535654fa',
      path: '/augsburg/en/events/third_event',
      title: 'third Event',
      availableLanguages: new Map(
        [['de', '/augsburg/de/events/drittes_event'], ['ar', '/augsburg/ar/events/erstes_event']]),
      date: new DateModel({
        startDate: moment('2017-11-18T09:30:00.000Z'),
        endDate: moment('2017-11-18T19:30:00.000Z'),
        allDay: true
      }),
      location: new LocationModel({
        name: 'name',
        address: 'address',
        town: 'town',
        postcode: 'postcode',
        latitude: null,
        longitude: null,
        state: 'state',
        region: 'region',
        country: 'country'
      }),
      content: 'content',
      excerpt: 'excerpt',
      lastUpdate: moment('2016-01-07 10:36:24'),
      thumbnail: 'thumbnail',
      featuredImage: null
    })
  ]

  const language = 'de'
  const city = 'augsburg'
  const location = route => createLocation({ type: route, payload: { city, language } })
  const onStickyTopChanged = (value: number) => {}

  describe('NavigationItems', () => {
    it('should be empty, if extras and news are both disabled', () => {
      const component = shallow(<LocationHeader location={location(CATEGORIES_ROUTE)}
                                                isExtrasEnabled={false}
                                                isEventsEnabled={false}
                                                isLocalNewsEnabled={false}
                                                isTunewsEnabled={false}
                                                viewportSmall
                                                cityName='Stadt Augsburg'
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
                                                 isLocalNewsEnabled={false}
                                                 isTunewsEnabled={false}
                                                 viewportSmall
                                                 cityName='Stadt Augsburg'
                                                 events={events}
                                                 languageChangePaths={languageChangePaths}
                                                 onStickyTopChanged={onStickyTopChanged}
                                                 t={t} />)
      const eventsComp = shallow(<LocationHeader location={location(CATEGORIES_ROUTE)}
                                                 isExtrasEnabled={false}
                                                 isEventsEnabled
                                                 isLocalNewsEnabled={false}
                                                 isTunewsEnabled={false}
                                                 viewportSmall
                                                 cityName='Stadt Augsburg'
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
                                                isLocalNewsEnabled={false}
                                                isTunewsEnabled={false}
                                                viewportSmall
                                                cityName='Stadt Augsburg'
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
                                                isLocalNewsEnabled={false}
                                                isTunewsEnabled={false}
                                                viewportSmall
                                                cityName='Stadt Augsburg'
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
                                                isLocalNewsEnabled={false}
                                                isTunewsEnabled={false}
                                                viewportSmall
                                                cityName='Stadt Augsburg'
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
                                                isLocalNewsEnabled={false}
                                                isTunewsEnabled={false}
                                                viewportSmall
                                                cityName='Stadt Augsburg'
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
                                                isLocalNewsEnabled={false}
                                                isTunewsEnabled={false}
                                                viewportSmall
                                                cityName='Stadt Augsburg'
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
                                                isLocalNewsEnabled={false}
                                                isTunewsEnabled={false}
                                                viewportSmall
                                                cityName='Stadt Augsburg'
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
                                                isLocalNewsEnabled={false}
                                                isTunewsEnabled={false}
                                                viewportSmall
                                                cityName='Stadt Augsburg'
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
                                              isLocalNewsEnabled={false}
                                              isTunewsEnabled={false}
                                              viewportSmall
                                              cityName='Stadt Augsburg'
                                              events={events}
                                              languageChangePaths={languageChangePaths}
                                              onStickyTopChanged={onStickyTopChanged}
                                              t={t} />)
    expect(component).toMatchSnapshot()
  })

  // fixme: Test the events enabled functionality. Especially isEventsActive()
})
