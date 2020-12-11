// @flow

import { shallow } from 'enzyme'
import React from 'react'
import { CityModel, DateModel, EventModel, LocationModel } from 'api-client'
import { LocationHeader } from '../LocationHeader'
import { CATEGORIES_ROUTE } from '../../../app/route-configs/CategoriesRouteConfig'
import { EVENTS_ROUTE } from '../../../app/route-configs/EventsRouteConfig'
import { OFFERS_ROUTE } from '../../../app/route-configs/OffersRouteConfig'
import moment from 'moment'
import { WOHNEN_ROUTE } from '../../../app/route-configs/WohnenRouteConfig'
import { SPRUNGBRETT_ROUTE } from '../../../app/route-configs/SprungbrettRouteConfig'
import createLocation from '../../../../createLocation'
import { LOCAL_NEWS_ROUTE } from '../../../app/route-configs/LocalNewsRouteConfig'

describe('LocationHeader', () => {
  const t = (key: ?string): string => key || ''

  const cityModel = (
    offersEnabled: boolean,
    eventsEnabled: boolean,
    poisEnabled: boolean,
    tunewsEnabled: boolean,
    pushNotificationsEnabled: boolean
  ) =>
    new CityModel({
      name: 'Stadt Augsburg',
      code: 'augsburg',
      live: true,
      eventsEnabled,
      offersEnabled,
      poisEnabled,
      pushNotificationsEnabled,
      tunewsEnabled,
      sortingName: 'Augsburg',
      prefix: 'Stadt',
      latitude: 48.369696,
      longitude: 10.892578,
      aliases: {
        Konigsbrunn: {
          latitude: 48.267499,
          longitude: 10.889586
        }
      }
    })

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
    it('should be empty if all other header items are disabled', () => {
      const component = shallow(<LocationHeader location={location(CATEGORIES_ROUTE)}
                                                viewportSmall
                                                cityModel={cityModel(false, false, false, false, false)}
                                                events={events}
                                                languageChangePaths={languageChangePaths}
                                                onStickyTopChanged={onStickyTopChanged}
                                                t={t} />)
      expect(component.instance().getNavigationItems()).toMatchSnapshot()
    })

    it('should show categories, if offers or news are enabled', () => {
      const offersComp = shallow(<LocationHeader location={location(CATEGORIES_ROUTE)}
                                                 cityModel={cityModel(true, false, false, false, false)}
                                                 viewportSmall
                                                 events={events}
                                                 languageChangePaths={languageChangePaths}
                                                 onStickyTopChanged={onStickyTopChanged}
                                                 t={t} />)
      const eventsComp = shallow(<LocationHeader location={location(CATEGORIES_ROUTE)}
                                                 viewportSmall
                                                 cityModel={cityModel(false, true, false, false, false)}
                                                 events={events}
                                                 languageChangePaths={languageChangePaths}
                                                 onStickyTopChanged={onStickyTopChanged}
                                                 t={t} />)

      expect(offersComp.instance().getNavigationItems()).toMatchSnapshot()
      expect(eventsComp.instance().getNavigationItems()).toMatchSnapshot()
    })

    it('should show categories, news, events, offers, pois in this order', () => {
      const component = shallow(<LocationHeader location={location(CATEGORIES_ROUTE)}
                                                viewportSmall
                                                cityModel={cityModel(true, true, true, true, true)}
                                                events={events}
                                                languageChangePaths={languageChangePaths}
                                                onStickyTopChanged={onStickyTopChanged}
                                                t={t} />)
      expect(component.instance().getNavigationItems()).toMatchSnapshot()
    })

    it('should highlight localInformation if route corresponds', () => {
      const component = shallow(<LocationHeader location={location(CATEGORIES_ROUTE)}
                                                viewportSmall
                                                cityModel={cityModel(true, true, true, true, true)}
                                                events={events}
                                                languageChangePaths={languageChangePaths}
                                                onStickyTopChanged={onStickyTopChanged}
                                                t={t} />)
      const navItem = component.instance().getNavigationItems().find(item => item.props.text === 'localInformation')
      expect(navItem?.props.active).toBe(true)
    })

    it('should highlight news if route corresponds', () => {
      const component = shallow(<LocationHeader location={location(LOCAL_NEWS_ROUTE)}
                                                viewportSmall
                                                cityModel={cityModel(true, true, true, true, true)}
                                                events={events}
                                                languageChangePaths={languageChangePaths}
                                                onStickyTopChanged={onStickyTopChanged}
                                                t={t} />)
      const navItem = component.instance().getNavigationItems().find(item => item.props.text === 'news')
      expect(navItem?.props.active).toBe(true)
    })

    it('should highlight events if route corresponds', () => {
      const component = shallow(<LocationHeader location={location(EVENTS_ROUTE)}
                                                viewportSmall
                                                cityModel={cityModel(true, true, true, true, true)}
                                                events={events}
                                                languageChangePaths={languageChangePaths}
                                                onStickyTopChanged={onStickyTopChanged}
                                                t={t} />)
      const navItem = component.instance().getNavigationItems().find(item => item.props.text === 'events')
      expect(navItem?.props.active).toBe(true)
    })

    it('should highlight offers if offers route is active', () => {
      const component = shallow(<LocationHeader location={location(OFFERS_ROUTE)}
                                                viewportSmall
                                                cityModel={cityModel(true, true, true, true, true)}
                                                events={events}
                                                languageChangePaths={languageChangePaths}
                                                onStickyTopChanged={onStickyTopChanged}
                                                t={t} />)
      const navItem = component.instance().getNavigationItems().find(item => item.props.text === 'offers')
      expect(navItem?.props.active).toBe(true)
    })

    it('should highlight offers if sprungbrett route is selected', () => {
      const component = shallow(<LocationHeader location={location(SPRUNGBRETT_ROUTE)}
                                                viewportSmall
                                                cityModel={cityModel(true, true, true, true, true)}
                                                events={events}
                                                languageChangePaths={languageChangePaths}
                                                onStickyTopChanged={onStickyTopChanged}
                                                t={t} />)
      const navItem = component.instance().getNavigationItems().find(item => item.props.text === 'offers')
      expect(navItem?.props.active).toBe(true)
    })

    it('should highlight offers if wohnen route is selected', () => {
      const component = shallow(<LocationHeader location={location(WOHNEN_ROUTE)}
                                                viewportSmall
                                                cityModel={cityModel(true, true, true, true, true)}
                                                events={events}
                                                languageChangePaths={languageChangePaths}
                                                onStickyTopChanged={onStickyTopChanged}
                                                t={t} />)
      const navItem = component.instance().getNavigationItems().find(item => item.props.text === 'offers')
      expect(navItem?.props.active).toBe(true)
    })
  })

  describe('ActionItems', () => {
    it('should match snapshot', () => {
      const component = shallow(<LocationHeader location={location(OFFERS_ROUTE)}
                                                viewportSmall
                                                cityModel={cityModel(true, true, true, true, true)}
                                                events={events}
                                                languageChangePaths={languageChangePaths}
                                                onStickyTopChanged={onStickyTopChanged}
                                                t={t} />)

      expect(component.instance().getActionItems()).toMatchSnapshot()
    })
  })
})
