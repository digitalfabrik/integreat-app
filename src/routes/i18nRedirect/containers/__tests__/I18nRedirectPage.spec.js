// @flow

import React from 'react'
import { mount, shallow } from 'enzyme'
import ConnectedI18nRedirectPage, { I18nRedirectPage } from '../I18nRedirectPage'
import CityModel from '../../../../modules/endpoint/models/CityModel'
import createReduxStore from '../../../../modules/app/createReduxStore'
import { Provider } from 'react-redux'
import landingRoute from '../../../../modules/app/routes/landing'
import { getNotFoundPath } from '../../../../modules/app/routes/notFound'
import categoriesRoute from '../../../../modules/app/routes/categories'
import { I18N_REDIRECT_ROUTE } from '../../../../modules/app/routes/i18nRedirect'
import configureStore from 'redux-mock-store'

describe('I18nRedirectPage', () => {
  const language = 'de'

  const cities = [
    new CityModel({
      name: 'City',
      code: 'random_city',
      live: true,
      eventsEnabled: false,
      extrasEnabled: false,
      sortingName: 'City'
    })
  ]

  describe('get redirect path', () => {
    it('should return landing path if there is no param or the param is landing', () => {
      const instanceWithoutParam = shallow(
        <I18nRedirectPage cities={cities} redirect={() => {}} i18n={{language}} />
      ).instance()

      expect(instanceWithoutParam.getRedirectAction()).toEqual(landingRoute.getRoutePath({language}))

      const instanceWithLandingParam = shallow(
        <I18nRedirectPage cities={cities} redirect={() => {}} param='landing' i18n={{language}} />
      ).instance()

      expect(instanceWithLandingParam.getRedirectAction()).toEqual(landingRoute.getRoutePath({language}))
    })

    it('should return categories path if the param is a city', () => {
      const instance = shallow(
        <I18nRedirectPage cities={cities} redirect={() => {}} param='random_city' i18n={{language}} />
      ).instance()

      expect(instance.getRedirectAction()).toEqual(categoriesRoute.getRoutePath({city: 'random_city', language}))
    })

    it('should return not found path as default', () => {
      const instance = shallow(
        <I18nRedirectPage cities={cities} redirect={() => {}} param='not_found' i18n={{language}} />
      ).instance()

      expect(instance.getRedirectAction()).toEqual(getNotFoundPath())

      const instanceWithInvalidParam = shallow(
        <I18nRedirectPage cities={cities} redirect={() => {}} param='invalid_param' i18n={{language}} />
      ).instance()

      expect(instanceWithInvalidParam.getRedirectAction()).toEqual(getNotFoundPath())
    })
  })

  describe('connect', () => {
    it('should map state to props', () => {
      const param = 'param'
      const mockStore = configureStore()
      const location = {type: I18N_REDIRECT_ROUTE, payload: {param}}
      const store = mockStore(() => ({location}))

      const tree = mount(
        <Provider store={store}>
          <ConnectedI18nRedirectPage cities={cities} />
        </Provider>
      )

      expect(tree.find(I18nRedirectPage).props()).toEqual({
        cities,
        param,
        redirect: expect.any(Function),
        i18n: expect.anything()
      })
    })

    it('should map dispatch to props', () => {
      const store = createReduxStore()

      store.dispatch = jest.fn()
      expect(store.dispatch).not.toHaveBeenCalled()

      mount(
        <Provider store={store}>
          <ConnectedI18nRedirectPage cities={cities} />
        </Provider>
      )
      expect(store.dispatch).toHaveBeenCalledTimes(1)
    })
  })
})
