// @flow

import React from 'react'
import { mount, shallow } from 'enzyme'
import ConnectedI18nRedirectPage, { I18nRedirectPage } from '../I18nRedirectPage'
import createReduxStore from '../../../../modules/app/createReduxStore'
import { Provider } from 'react-redux'
import { I18N_REDIRECT_ROUTE } from '../../../../modules/app/route-configs/I18nRedirectRouteConfig'
import configureStore from 'redux-mock-store'
import CityModelBuilder from 'api-client/src/testing/CityModelBuilder'
import { NOT_FOUND_ROUTE } from '../../../../modules/app/route-configs/NotFoundRouteConfig'

jest.mock('react-i18next')

describe('I18nRedirectPage', () => {
  const language = 'de'

  const cities = new CityModelBuilder(1).build()

  describe('get redirect action', () => {
    it('should return landing path if there is no param or the param is landing', () => {
      const instanceWithoutParam = shallow(
        <I18nRedirectPage cities={cities} redirect={() => {}} i18n={{ language }} />
      ).instance()

      expect(instanceWithoutParam.getRedirectPath()).toEqual('/landing/de')

      const instanceWithLandingParam = shallow(
        <I18nRedirectPage cities={cities} redirect={() => {}} param='landing' i18n={{ language }} />
      ).instance()

      expect(instanceWithLandingParam.getRedirectPath()).toEqual('/landing/de')
    })

    it('should return categories path if the param is a city', () => {
      const instance = shallow(
        <I18nRedirectPage cities={cities} redirect={() => {}} param='augsburg' i18n={{ language }} />
      ).instance()

      expect(instance.getRedirectPath()).toEqual('/augsburg/de')
    })

    it('should return not found path as default', () => {
      const instance = shallow(
        <I18nRedirectPage cities={cities} redirect={() => {}} param='not_found' i18n={{ language }} />
      ).instance()

      expect(instance.getRedirectPath()).toEqual(NOT_FOUND_ROUTE)

      const instanceWithInvalidParam = shallow(
        <I18nRedirectPage cities={cities} redirect={() => {}} param='invalid_param' i18n={{ language }} />
      ).instance()

      expect(instanceWithInvalidParam.getRedirectPath()).toEqual(NOT_FOUND_ROUTE)
    })
  })

  describe('connect', () => {
    it('should map state to props', () => {
      const param = 'param'
      const mockStore = configureStore()
      const location = { type: I18N_REDIRECT_ROUTE, language: 'en', payload: { param } }
      const store = mockStore({ location })

      const tree = mount(
        <Provider store={store}>
          <ConnectedI18nRedirectPage cities={cities} />
        </Provider>
      )

      expect(tree.find(I18nRedirectPage).props()).toEqual({
        cities,
        i18n: expect.anything(),
        param,
        redirect: expect.any(Function),
        t: expect.any(Function)
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
