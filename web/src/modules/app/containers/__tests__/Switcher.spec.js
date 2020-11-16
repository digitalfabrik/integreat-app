// @flow

import * as React from 'react'
import ConnectedSwitcher, { Switcher } from '../Switcher'
import {
  CategoriesMapModel,
  CategoryModel,
  CityModel,
  DateModel,
  EventModel,
  OfferModel,
  LanguageModel,
  LocationModel,
  PageModel,
  Payload,
  PoiModel,
  SprungbrettJobModel,
  WohnenFormData,
  WohnenOfferModel
} from 'api-client'
import { mount, shallow } from 'enzyme'
import { CATEGORIES_ROUTE } from '../../route-configs/CategoriesRouteConfig'
import { LANDING_ROUTE } from '../../route-configs/LandingRouteConfig'
import { MAIN_DISCLAIMER_ROUTE } from '../../route-configs/MainDisclaimerRouteConfig'
import moment from 'moment'
import theme from '../../../theme/constants/theme'
import { ThemeProvider } from 'styled-components'
import { Provider } from 'react-redux'
import LocationLayout from '../../../layout/containers/LocationLayout'
import Layout from '../../../layout/components/Layout'
import Footer from '../../../layout/components/Footer'
import { Header } from '../../../layout/components/Header'
import createLocation from '../../../../createLocation'
import configureMockStore from 'redux-mock-store'
import { I18N_REDIRECT_ROUTE } from '../../route-configs/I18nRedirectRouteConfig'

describe('Switcher', () => {
  const categories = new CategoriesMapModel([
    new CategoryModel({
      root: true,
      path: 'path01',
      title: 'Title10',
      content: 'contnentl',
      thumbnail: 'thumb/nail',
      parentPath: 'parent/url',
      order: 4,
      hash: '2fe6283485a93932',
      availableLanguages: new Map(),
      lastUpdate: moment('2017-11-18T08:30:00.000Z')
    })
  ])
  const disclaimer = new PageModel({
    path: '/disclaimer',
    title: 'Feedback, Kontakt und mögliches Engagement',
    content: 'this is a test content',
    lastUpdate: moment('2017-11-18T08:30:00.000Z'),
    hash: '2fe6283485a93932'
  })

  const offers = [
    new OfferModel({
      alias: 'ihk-lehrstellenboerse',
      path: 'ihk-jobborese.com',
      title: 'Jobboerse',
      thumbnail: 'xy',
      postData: null
    }),
    new OfferModel({
      alias: 'ihk-praktikumsboerse',
      path: 'ihk-pratkitkumsboerse.com',
      title: 'Praktikumsboerse',
      thumbnail: 'xy',
      postData: null
    })
  ]

  const events = [
    new EventModel({
      path: '/augsburg/en/events/nulltes_event',
      title: 'nulltes Event',
      date: new DateModel({
        allDay: false,
        startDate: moment(0),
        endDate: moment(0)
      }),
      content: 'Huiiii',
      excerpt: 'Buuuuh',
      thumbnail: 'Ich hab deine Nase!',
      featuredImage: null,
      location: new LocationModel({
        name: 'Schloss',
        town: 'Schloss Burgeck',
        address: 'Adresse 0',
        postcode: 'postcode',
        latitude: null,
        longitude: null,
        state: 'state',
        region: 'region',
        country: 'country'
      }),
      availableLanguages: new Map(
        [['de', '/augsburg/de/events/nulltes_event'], ['ar', '/augsburg/ar/events/nulltes_event']]),
      lastUpdate: moment(0),
      hash: '2fe6283485a93932'
    })
  ]

  const cities = [
    new CityModel({
      name: 'Mambo No. 5',
      code: 'city1',
      live: true,
      eventsEnabled: true,
      offersEnabled: false,
      tunewsEnabled: false,
      pushNotificationsEnabled: false,
      sortingName: 'Mambo',
      prefix: 'Stadt',
      latitude: null,
      longitude: null,
      aliases: null
    })
  ]
  const languages = [
    new LanguageModel('de', 'Deutsch'),
    new LanguageModel('en', 'English')
  ]
  const sprungbrettJobs = [
    new SprungbrettJobModel({
      id: 0,
      title: 'WebDeveloper',
      location: 'Augsburg',
      isEmployment: true,
      isApprenticeship: true,
      url: 'http://awesome-jobs.domain'
    })
  ]
  const wohnenOffers = [
    new WohnenOfferModel({
      email: 'mail@mail.com',
      createdDate: moment('2018-07-24T00:00:00.000Z'),
      formDataType: WohnenFormData,
      formData: new WohnenFormData(
        {
          firstName: 'Max',
          lastName: 'Ammann',
          phone: ''
        },
        {
          ofRooms: ['kitchen', 'child2', 'child1', 'bed'],
          title: 'Test Angebot',
          location: 'Augsburg',
          totalArea: 120,
          totalRooms: 4,
          moveInDate: moment('2018-07-19T15:35:12.000Z'),
          ofRoomsDiff: ['bath', 'wc', 'child3', 'livingroom', 'hallway', 'store', 'basement', 'balcony']
        },
        {
          ofRunningServices: ['chimney', 'other'],
          ofAdditionalServices: ['garage'],
          baseRent: 1000,
          runningCosts: 1200,
          hotWaterInHeatingCosts: true,
          additionalCosts: 200,
          ofRunningServicesDiff: ['heating', 'water', 'garbage'],
          ofAdditionalServicesDiff: []
        })
    })
  ]

  const pois = [
    new PoiModel({
      hash: '2fe6283485a93932',
      path: '/augsburg/en/locations/first_poi',
      title: 'first Event',
      availableLanguages: new Map(
        [['de', '/augsburg/de/locations/erster_poi'], ['ar', '/augsburg/ar/locations/erster_poi']]),
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
      thumbnail: 'thumbnail'
    })
  ]

  const categoriesPayload = new Payload(false, 'https://random.api.json', categories, null)
  const eventsPayload = new Payload(false, 'https://random.api.json', events, null)
  const localNewsPayload = new Payload(true)
  const localNewsElementPayload = new Payload(true)
  const tunewsPayload = new Payload(true)
  const tunewsElementPayload = new Payload(true)
  const offersPayload = new Payload(false, 'https://random.api.json', offers, null)
  const disclaimerPayload = new Payload(false, 'https://random.api.json', disclaimer, null)
  const citiesPayload = new Payload(false, 'https://random.api.json', cities, null)
  const languagesPayload = new Payload(false, 'https://random.api.json', languages, null)
  const tunewsLanguagesPayload = new Payload(false, 'https://random.api.json', languages, null)
  const sprungbrettPayload = new Payload(false, 'https://random.api.json', sprungbrettJobs, null)
  const wohnenOffersPayload = new Payload(false, 'https://random.api.json', wohnenOffers, null)
  const poisPayload = new Payload(false, 'https://random.api.json', pois, null)

  const t = (key: ?string): string => key || ''

  const toggleDarkMode = () => {}

  const createSwitcher = (currentRoute: string, pathname?: string): React.Element<*> => {
    const location = createLocation({
      type: currentRoute,
      pathname,
      payload: { city: 'city1', language: 'de' },
      prev: { payload: { param: 'param' }, type: 'RANDOM_TYPE', pathname: '/param' }
    })
    return (
      <Switcher viewportSmall={false} location={location} citiesPayload={citiesPayload}
                categoriesPayload={categoriesPayload} eventsPayload={eventsPayload} offersPayload={offersPayload}
                localNewsPayload={localNewsPayload} localNewsElementPayload={localNewsElementPayload}
                tunewsPayload={tunewsPayload} tunewsElementPayload={tunewsElementPayload} poisPayload={poisPayload}
                disclaimerPayload={disclaimerPayload} languages={languages}
                tunewsLanguagesPayload={tunewsLanguagesPayload} t={t}
                sprungbrettJobsPayload={sprungbrettPayload} wohnenOffersPayload={wohnenOffersPayload} darkMode
                toggleDarkMode={toggleDarkMode} />
    )
  }

  describe('layout', () => {
    it('should render a location layout if the current route is a location layout route', () => {
      const switcher = shallow(
        createSwitcher(CATEGORIES_ROUTE, 'path01')
      )

      expect(switcher.find(LocationLayout)).not.toBeNull()
    })

    it('should render a layout with a footer if the current route is the landing route', () => {
      const switcher = shallow(
        createSwitcher(LANDING_ROUTE)
      )
      expect(switcher.find(Layout)).not.toBeNull()
      expect(switcher.find(Footer)).not.toBeNull()
    })

    it('should render a layout with a header and a footer as default', () => {
      const switcher = shallow(
        createSwitcher(MAIN_DISCLAIMER_ROUTE)
      )

      expect(switcher.find(Layout)).not.toBeNull()
      expect(switcher.find(Footer)).not.toBeNull()
      expect(switcher.find(Header)).not.toBeNull()
    })
  })

  it('should map state to props', () => {
    const location = createLocation({
      type: CATEGORIES_ROUTE,
      payload: { city: 'augsburg', language: 'de' },
      prev: { type: I18N_REDIRECT_ROUTE, pathname: '/param', payload: { param: 'param' } },
      pathname: '/augsburg/de'
    })
    const mockStore = configureMockStore()
    const store = mockStore({
      events: eventsPayload,
      cities: citiesPayload,
      categories: categoriesPayload,
      disclaimer: disclaimerPayload,
      offers: offersPayload,
      languages: languagesPayload,
      location,
      pois: poisPayload,
      wohnen: wohnenOffersPayload,
      tunews: { allData: [], hasMore: true, tunewsPayload },
      sprungbrettJobs: sprungbrettPayload,
      viewport: { is: { small: true } },
      darkMode: true
    })

    const tree = mount(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <ConnectedSwitcher />
        </Provider>
      </ThemeProvider>
    )

    expect(tree.find(Switcher).props()).toEqual({
      location,
      categoriesPayload,
      citiesPayload,
      darkMode: true,
      disclaimerPayload,
      eventsPayload,
      offersPayload,
      i18n: expect.anything(),
      languages,
      poisPayload,
      sprungbrettJobsPayload: sprungbrettPayload,
      t: expect.any(Function),
      toggleDarkMode: expect.any(Function),
      viewportSmall: true,
      wohnenOffersPayload
    })
  })
})
