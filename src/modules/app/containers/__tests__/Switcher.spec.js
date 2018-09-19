// @flow

import * as React from 'react'
import ConnectedSwitcher, { Switcher } from '../Switcher'
import Payload from '../../../endpoint/Payload'
import { shallow, mount } from 'enzyme'
import { CATEGORIES_ROUTE } from '../../routes/categories'
import { LANDING_ROUTE } from '../../routes/landing'
import { MAIN_DISCLAIMER_ROUTE } from '../../routes/mainDisclaimer'
import { EXTRAS_ROUTE } from '../../routes/extras'
import { EVENTS_ROUTE } from '../../routes/events'
import { DISCLAIMER_ROUTE } from '../../routes/disclaimer'
import { SEARCH_ROUTE } from '../../routes/search'
import { I18N_REDIRECT_ROUTE } from '../../routes/i18nRedirect'
import CityModel from '../../../endpoint/models/CityModel'
import CategoriesMapModel from '../../../endpoint/models/CategoriesMapModel'
import EventModel from '../../../endpoint/models/EventModel'
import ExtraModel from '../../../endpoint/models/ExtraModel'
import DisclaimerModel from '../../../endpoint/models/DisclaimerModel'
import CategoryModel from '../../../endpoint/models/CategoryModel'
import moment from 'moment-timezone'
import LanguageModel from '../../../endpoint/models/LanguageModel'
import SprungbrettJobModel from '../../../endpoint/models/SprungbrettJobModel'
import WohnenFormData from '../../../endpoint/models/WohnenFormData'
import WohnenOfferModel from '../../../endpoint/models/WohnenOfferModel'
import { SPRUNGBRETT_ROUTE } from '../../routes/sprungbrett'
import { WOHNEN_ROUTE } from '../../routes/wohnen'
import createHistory from '../../createHistory'
import theme from '../../../theme/constants/theme'
import createReduxStore from '../../createReduxStore'
import { ThemeProvider } from 'styled-components'
import { Provider } from 'react-redux'

describe('Switcher', () => {
  const categories = new CategoriesMapModel([
    new CategoryModel({
      id: 1,
      path: 'path01',
      title: 'Title10',
      content: 'contnentl',
      thumbnail: 'thumb/nail',
      parentPath: 'parent/url',
      order: 4,
      availableLanguages: new Map(),
      lastUpdate: moment.tz('2017-11-18 09:30:00', 'UTC')
    })
  ])
  const disclaimer = new DisclaimerModel({
    id: 1689,
    title: 'Feedback, Kontakt und mögliches Engagement',
    content: 'this is a test content',
    lastUpdate: moment.tz('2017-11-18 09:30:00', 'UTC')
  })

  const extras = [
    new ExtraModel({
      alias: 'ihk-lehrstellenboerse',
      path: 'ihk-jobborese.com',
      title: 'Jobboerse',
      thumbnail: 'xy',
      postData: null
    }),
    new ExtraModel({
      alias: 'ihk-praktikumsboerse',
      path: 'ihk-pratkitkumsboerse.com',
      title: 'Praktikumsboerse',
      thumbnail: 'xy',
      postData: null
    })
  ]
  const events = [
    new EventModel({
      id: 1234,
      title: 'first Event',
      availableLanguages: new Map([['de', 1235], ['ar', 1236]]),
      startDate: moment.tz('2017-11-18 09:30:00', 'UTC'),
      endDate: moment.tz('2017-11-18 19:30:00', 'UTC'),
      allDay: true,
      address: 'address',
      content: 'content',
      excerpt: 'excerpt',
      thumbnail: 'thumbnail',
      town: 'town'
    })]

  const cities = [
    new CityModel({
      name: 'Mambo No. 5',
      code: 'city1',
      live: true,
      eventsEnabled: true,
      extrasEnabled: false,
      sortingName: 'Mambo'
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

  const categoriesPayload = new Payload(false, 'https://random.api.json', categories, null)
  const eventsPayload = new Payload(false, 'https://random.api.json', events, null)
  const extrasPayload = new Payload(false, 'https://random.api.json', extras, null)
  const disclaimerPayload = new Payload(false, 'https://random.api.json', disclaimer, null)
  const citiesPayload = new Payload(false, 'https://random.api.json', cities, null)
  const languagesPayload = new Payload(false, 'https://random.api.json', languages, null)
  const sprungbrettPayload = new Payload(false, 'https://random.api.json', sprungbrettJobs, null)
  const wohnenPayload = new Payload(false, 'https://random.api.json', wohnenOffers, null)

  const errorPayload = new Payload(false, 'https://random.api.json', null, new Error('fake news'))
  const fetchingPayload = new Payload(true)

  const createSwitcher = (currentRoute: string): React.Node =>
    <Switcher viewportSmall={false} currentRoute={currentRoute} citiesPayload={citiesPayload}
              categoriesPayload={categoriesPayload} eventsPayload={eventsPayload} extrasPayload={extrasPayload}
              disclaimerPayload={disclaimerPayload} languages={languages} city={'city1'} language={'de'}
              sprungbrettJobsPayload={sprungbrettPayload} wohnenPayload={wohnenPayload} param={'param'} darkMode />

  describe('layout', () => {
    it('should render a location layout if the current route is a location layout route', () => {
      const switcher = shallow(
        createSwitcher(CATEGORIES_ROUTE)
      )

      expect(switcher).toMatchSnapshot()
    })

    it('should render a layout with a footer if the current route is the landing route', () => {
      const switcher = shallow(
        createSwitcher(LANDING_ROUTE)
      )

      expect(switcher).toMatchSnapshot()
    })

    it('should render a layout with a header and a footer as default', () => {
      const switcher = shallow(
        createSwitcher(MAIN_DISCLAIMER_ROUTE)
      )

      expect(switcher).toMatchSnapshot()
    })
  })

  it('should return a spinner if the data has not been fetched yet', () => {
    expect(Switcher.renderFailureLoadingComponents([fetchingPayload])).toMatchSnapshot()
  })

  it('should return a failure if there was an error during fetching', () => {
    expect(Switcher.renderFailureLoadingComponents([errorPayload])).toMatchSnapshot()
  })

  describe('should get the right page if data has been fetched and', () => {
    it('is the categories route', () => {
      const switcher = shallow(
        createSwitcher(CATEGORIES_ROUTE)
      )

      expect(switcher).toMatchSnapshot()
    })

    it('is the extras route', () => {
      const switcher = shallow(
        createSwitcher(EXTRAS_ROUTE)
      )

      expect(switcher).toMatchSnapshot()
    })

    it('is the events route', () => {
      const switcher = shallow(
        createSwitcher(EVENTS_ROUTE)
      )

      expect(switcher).toMatchSnapshot()
    })

    it('is the disclaimer route', () => {
      const switcher = shallow(
        createSwitcher(DISCLAIMER_ROUTE)
      )

      expect(switcher).toMatchSnapshot()
    })

    it('is the search route', () => {
      const switcher = shallow(
        createSwitcher(SEARCH_ROUTE)
      )

      expect(switcher).toMatchSnapshot()
    })

    it('is the main disclaimer route', () => {
      const switcher = shallow(
        createSwitcher(MAIN_DISCLAIMER_ROUTE)
      )

      expect(switcher).toMatchSnapshot()
    })

    it('is the landing route', () => {
      const switcher = shallow(
        createSwitcher(LANDING_ROUTE)
      )

      expect(switcher).toMatchSnapshot()
    })

    it('is the i18nRedirect route', () => {
      const switcher = shallow(
        createSwitcher(I18N_REDIRECT_ROUTE)
      )

      expect(switcher).toMatchSnapshot()
    })

    it('is the wohnen route', () => {
      const switcher = shallow(
        createSwitcher(WOHNEN_ROUTE)
      )

      expect(switcher).toMatchSnapshot()
    })

    it('is the sprungbrett route', () => {
      const switcher = shallow(
        createSwitcher(SPRUNGBRETT_ROUTE)
      )

      expect(switcher).toMatchSnapshot()
    })
  })

  it('should map state to props', () => {
    const currentRoute = CATEGORIES_ROUTE
    const location = {
      type: currentRoute,
      payload: {city: 'augsburg', language: 'de'},
      prev: {payload: {param: 'param'}}
    }

    const store = createReduxStore(createHistory, {
      events: eventsPayload,
      cities: citiesPayload,
      categories: categoriesPayload,
      disclaimer: disclaimerPayload,
      extras: extrasPayload,
      languages: languagesPayload,
      wohnen: wohnenPayload,
      sprungbrettJobs: sprungbrettPayload,
      viewport: {is: {small: true}},
      darkMode: true
    })
    store.getState().location = location
    store.getState().cities = citiesPayload

    const tree = mount(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <ConnectedSwitcher />
        </Provider>
      </ThemeProvider>
    )

    expect(tree.find(Switcher).props()).toEqual({
      currentRoute,
      categoriesPayload,
      eventsPayload,
      extrasPayload,
      citiesPayload,
      disclaimerPayload,
      sprungbrettJobsPayload: sprungbrettPayload,
      wohnenPayload,
      languages,
      dispatch: expect.any(Function),
      viewportSmall: true,
      city: 'augsburg',
      param: 'param',
      language: 'de',
      darkMode: true
    })
  })
})
