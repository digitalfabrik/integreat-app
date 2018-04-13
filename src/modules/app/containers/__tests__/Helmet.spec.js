import React from 'react'
import CategoryModel from '../../../endpoint/models/CategoryModel'
import EventModel from '../../../endpoint/models/EventModel'
import CategoriesMapModel from '../../../endpoint/models/CategoriesMapModel'
import { shallow } from 'enzyme'
import ConnectedHelmet, { Helmet } from '../Helmet'
import { CATEGORIES_ROUTE } from '../../routes/categories'
import ExtraModel from '../../../endpoint/models/ExtraModel'
import { EXTRAS_ROUTE } from '../../routes/extras'
import { EVENTS_ROUTE } from '../../routes/events'
import { SEARCH_ROUTE } from '../../routes/search'
import { DISCLAIMER_ROUTE } from '../../routes/disclaimer'
import { MAIN_DISCLAIMER_ROUTE } from '../../routes/mainDisclaimer'
import { LANDING_ROUTE } from '../../routes/landing'
import CityModel from '../../../endpoint/models/CityModel'
import configureMockStore from 'redux-mock-store'

describe('Helmet', () => {
  const city = 'augsburg'

  const events = [
    new EventModel({
      id: '1234',
      title: 'Erstes Event'
    })]

  const categoryModels = [
    new CategoryModel({
      id: 3650,
      url: '/augsburg/en/welcome',
      title: 'Welcome'
    })]

  const categories = new CategoriesMapModel(categoryModels)

  const extras = [new ExtraModel({
    title: 'Sprungbrett',
    alias: 'sprungbrett'
  })]

  const cities = [new CityModel({
    code: city,
    name: 'Augsburg'
  })]

  describe('get route page title', () => {
    it('should return the title of the current category if it is not the root category', () => {
      const location = {type: CATEGORIES_ROUTE, payload: {city}, pathname: '/augsburg/en/welcome'}
      const helmet = shallow(
        <Helmet location={location} categories={categories} />
      )

      expect(helmet.instance().getRoutePageTitle()).toBe('Welcome')
    })

    it('should return the title of the current extra', () => {
      const location = {type: EXTRAS_ROUTE, payload: {city, extraAlias: 'sprungbrett'}}
      const helmet = shallow(
        <Helmet location={location} extras={extras} />
      )

      expect(helmet.instance().getRoutePageTitle()).toBe('Sprungbrett')
    })

    it('should return "extras"', () => {
      const location = {type: EXTRAS_ROUTE, payload: {city}}
      const helmet = shallow(
        <Helmet location={location} t={key => key} />
      )

      expect(helmet.instance().getRoutePageTitle()).toBe('extras')
    })

    it('should return the title of the current event', () => {
      const location = {type: EVENTS_ROUTE, payload: {city, eventId: '1234'}}
      const helmet = shallow(
        <Helmet location={location} events={events} />
      )

      expect(helmet.instance().getRoutePageTitle()).toBe('Erstes Event')
    })

    it('should return "events" if it is the events route', () => {
      const location = {type: EVENTS_ROUTE, payload: {city}}
      const helmet = shallow(
        <Helmet location={location} t={key => key} />
      )

      expect(helmet.instance().getRoutePageTitle()).toBe('events')
    })

    it('should return "search" if it is the search route', () => {
      const location = {type: SEARCH_ROUTE, payload: {city}}
      const helmet = shallow(
        <Helmet location={location} t={key => key} />
      )

      expect(helmet.instance().getRoutePageTitle()).toBe('search')
    })

    it('should return "disclaimer" if it is the disclaimer route', () => {
      const location = {type: DISCLAIMER_ROUTE, payload: {city}}
      const helmet = shallow(
        <Helmet location={location} t={key => key} />
      )

      expect(helmet.instance().getRoutePageTitle()).toBe('disclaimer')
    })

    it('should return "disclaimer" if it is the main disclaimer route', () => {
      const location = {type: MAIN_DISCLAIMER_ROUTE, payload: {}}
      const helmet = shallow(
        <Helmet location={location} t={key => key} />
      )

      expect(helmet.instance().getRoutePageTitle()).toBe('disclaimer')
    })

    it('should return "landing" if it is the landing route', () => {
      const location = {type: LANDING_ROUTE, payload: {}}
      const helmet = shallow(
        <Helmet location={location} t={key => key} />
      )

      expect(helmet.instance().getRoutePageTitle()).toBe('landing')
    })
  })

  describe('get page title', () => {
    it('should return "Integreat" if there is neither a city nor a current route title', () => {
      const location = {type: CATEGORIES_ROUTE, payload: {}}
      const helmet = shallow(
        <Helmet location={location} t={key => key} />
      )

      expect(helmet.instance().getPageTitle()).toBe('Integreat')
    })

    it('should return the current route title and "Integreat"', () => {
      const location = {type: LANDING_ROUTE, payload: {}}
      const helmet = shallow(
        <Helmet location={location} t={key => key} />
      )

      expect(helmet.instance().getPageTitle()).toBe('landing - Integreat')
    })

    it('should return the current route title, cityName and "Integreat"', () => {
      const location = {type: DISCLAIMER_ROUTE, payload: {city: city}}
      const helmet = shallow(
        <Helmet location={location} t={key => key} cities={cities} />
      )

      expect(helmet.instance().getPageTitle()).toBe('disclaimer - Augsburg - Integreat')
    })
  })

  it('should match snapshot', () => {
    const location = {type: DISCLAIMER_ROUTE, payload: {city: city}}
    const helmet = shallow(
      <Helmet location={location} t={key => key} cities={cities} />
    )

    expect(helmet).toMatchSnapshot()
  })

  it('should map state to props', () => {
    const param = 'param'

    const location = {payload: {param}}

    const mockStore = configureMockStore()
    const store = mockStore({
      location: location,
      cities: {data: cities},
      categories: {data: categories},
      events: {data: events},
      extras: {data: extras}
    })

    const connectedHelmet = shallow(
      <ConnectedHelmet store={store} />
    )

    expect(connectedHelmet.props()).toEqual({
      cities,
      extras,
      categories,
      events,
      location,
      store: store,
      storeSubscription: expect.any(Object),
      dispatch: expect.any(Function)
    })
  })
})
