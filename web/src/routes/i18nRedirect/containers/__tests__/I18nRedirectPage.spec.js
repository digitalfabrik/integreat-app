// @flow

import React from 'react'
import I18nRedirectPage from '../I18nRedirectPage'
import { Provider } from 'react-redux'
import { I18N_REDIRECT_ROUTE } from '../../../../modules/app/route-configs/I18nRedirectRouteConfig'
import configureStore from 'redux-mock-store'
import CityModelBuilder from 'api-client/src/testing/CityModelBuilder'
import { render } from '@testing-library/react'
import { redirect } from 'redux-first-router'
import LandingRouteConfig from '../../../../modules/app/route-configs/LandingRouteConfig'
import CategoriesRouteConfig from '../../../../modules/app/route-configs/CategoriesRouteConfig'
import NotFoundRouteConfig from '../../../../modules/app/route-configs/NotFoundRouteConfig'
import buildConfig from '../../../../modules/app/constants/buildConfig'

jest.mock('react-i18next')
jest.mock('redux-first-router', () => ({
  pathToAction: jest.fn(type => ({ type })),
  redirect: jest.fn(action => action)
}))
jest.mock('../../../../modules/app/constants/buildConfig', () => jest.fn(() => ({
  featureFlags: { selectedCity: null }
})))

describe('I18nRedirectPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const language = 'ar'
  const i18n = { language }

  const cities = new CityModelBuilder(2).build()
  const city = cities[0].code

  describe('no preselected city in build config', () => {
    it('should navigate to landing route if there is no url param ', () => {
      const mockStore = configureStore()
      const location = {
        type: I18N_REDIRECT_ROUTE,
        language: 'en',
        payload: { param: '' }
      }
      const store = mockStore({ location })

      render(
        <Provider store={store}>
          <I18nRedirectPage cities={cities} i18n={i18n} />
        </Provider>
      )

      expect(redirect).toHaveBeenCalledWith({
        type: new LandingRouteConfig().getRoutePath({ language })
      })
    })

    it('should navigate to landing route if param is landing', () => {
      const mockStore = configureStore()
      const location = {
        type: I18N_REDIRECT_ROUTE,
        language: 'en',
        payload: { param: 'landing' }
      }
      const store = mockStore({ location })

      render(
        <Provider store={store}>
          <I18nRedirectPage cities={cities} i18n={i18n} />
        </Provider>
      )

      expect(redirect).toHaveBeenCalledWith({
        type: new LandingRouteConfig().getRoutePath({ language })
      })
    })

    it('should navigate to categories route if the param is a valid city', () => {
      const mockStore = configureStore()
      const location = {
        type: I18N_REDIRECT_ROUTE,
        language: 'en',
        payload: { param: city }
      }
      const store = mockStore({ location })

      render(
        <Provider store={store}>
          <I18nRedirectPage cities={cities} i18n={i18n} />
        </Provider>
      )

      expect(redirect).toHaveBeenCalledWith({
        type: new CategoriesRouteConfig().getRoutePath({ language, city })
      })
    })

    it('should navigate to not found else', () => {
      const mockStore = configureStore()
      const location = {
        type: I18N_REDIRECT_ROUTE,
        language: 'en',
        payload: { param: 'random-not-found' }
      }
      const store = mockStore({ location })

      render(
        <Provider store={store}>
          <I18nRedirectPage cities={cities} i18n={i18n} />
        </Provider>
      )

      expect(redirect).toHaveBeenCalledWith({
        type: new NotFoundRouteConfig().getRoutePath()
      })
    })
  })

  describe('preselected city in build config', () => {
    it('should navigate to preselected city if there is no url param', () => {
      // $FlowFixMe build config is a mock and has function mockImplementationOnce
      buildConfig.mockImplementationOnce(() => ({
        featureFlags: { selectedCity: city }
      }))
      const mockStore = configureStore()
      const location = {
        type: I18N_REDIRECT_ROUTE,
        language: 'en',
        payload: { param: '' }
      }
      const store = mockStore({ location })

      render(
        <Provider store={store}>
          <I18nRedirectPage cities={cities} i18n={i18n} />
        </Provider>
      )

      expect(redirect).toHaveBeenCalledWith({
        type: new CategoriesRouteConfig().getRoutePath({ language, city })
      })
    })

    it('should navigate to preselected city if the url param is landing', () => {
      // $FlowFixMe build config is a mock and has function mockImplementationOnce
      buildConfig.mockImplementationOnce(() => ({
        featureFlags: { selectedCity: city }
      }))
      const mockStore = configureStore()
      const location = {
        type: I18N_REDIRECT_ROUTE,
        language: 'en',
        payload: { param: 'landing' }
      }
      const store = mockStore({ location })

      render(
        <Provider store={store}>
          <I18nRedirectPage cities={cities} i18n={i18n} />
        </Provider>
      )

      expect(redirect).toHaveBeenCalledWith({
        type: new CategoriesRouteConfig().getRoutePath({ language, city })
      })
    })

    it('should navigate to preselected city if the param is the preselected city', () => {
      // $FlowFixMe build config is a mock and has function mockImplementationOnce
      buildConfig.mockImplementationOnce(() => ({
        featureFlags: { selectedCity: city }
      }))
      const mockStore = configureStore()
      const location = {
        type: I18N_REDIRECT_ROUTE,
        language: 'en',
        payload: { param: city }
      }
      const store = mockStore({ location })

      render(
        <Provider store={store}>
          <I18nRedirectPage cities={cities} i18n={i18n} />
        </Provider>
      )

      expect(redirect).toHaveBeenCalledWith({
        type: new CategoriesRouteConfig().getRoutePath({ language, city })
      })
    })

    it('should navigate to not found if the param is another city', () => {
      // $FlowFixMe build config is a mock and has function mockImplementationOnce
      buildConfig.mockImplementationOnce(() => ({
        featureFlags: { selectedCity: city }
      }))
      const mockStore = configureStore()
      const location = {
        type: I18N_REDIRECT_ROUTE,
        language: 'en',
        payload: { param: cities[1].code }
      }
      const store = mockStore({ location })

      render(
        <Provider store={store}>
          <I18nRedirectPage cities={cities} i18n={i18n} />
        </Provider>
      )

      expect(redirect).toHaveBeenCalledWith({
        type: new NotFoundRouteConfig().getRoutePath()
      })
    })

    it('should navigate to not found else', () => {
      // $FlowFixMe build config is a mock and has function mockImplementationOnce
      buildConfig.mockImplementationOnce(() => ({
        featureFlags: { selectedCity: city }
      }))
      const mockStore = configureStore()
      const location = {
        type: I18N_REDIRECT_ROUTE,
        language: 'en',
        payload: { param: 'random-not-found' }
      }
      const store = mockStore({ location })

      render(
        <Provider store={store}>
          <I18nRedirectPage cities={cities} i18n={i18n} />
        </Provider>
      )

      expect(redirect).toHaveBeenCalledWith({
        type: new NotFoundRouteConfig().getRoutePath()
      })
    })
  })
})
