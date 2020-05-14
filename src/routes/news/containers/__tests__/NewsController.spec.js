// @flow

import React from 'react'
import { mount, shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'
import ConnectedNewsRedirectController, { NewsRedirectController } from '../NewsRedirectController'
import { CityModel } from '@integreat-app/integreat-api-client'
import { Provider } from 'react-redux'
import createLocation from '../../../../createLocation'
import { TUNEWS_ROUTE } from '../../../../modules/app/route-configs/TunewsRouteConfig'
import theme from '../../../../modules/theme/constants/theme'
import { ThemeProvider } from 'styled-components'

describe('NewsRedirectController', () => {
  const cities = [
    new CityModel({
      name: 'Augsburg',
      code: 'augsburg',
      live: true,
      eventsEnabled: true,
      extrasEnabled: true,
      pushNotificationsEnabled: true,
      tunewsEnabled: true,
      sortingName: 'Augsburg',
      prefix: null,
      longitude: 10.89779,
      latitude: 48.3705449,
      aliases: { Gersthofen: { longitude: 10.89779, latitude: 48.3705449 } }
    }),
    new CityModel({
      name: 'Stadt Regensburg',
      code: 'regensburg',
      live: true,
      eventsEnabled: false,
      extrasEnabled: false,
      pushNotificationsEnabled: false,
      tunewsEnabled: false,
      sortingName: 'Regensburg',
      prefix: 'Stadt',
      latitude: null,
      longitude: null,
      aliases: null
    })
  ]

  const city = 'augsburg'
  const language = 'en'

  it('should match snapshot and render NewsRedirectController', () => {
    const wrapper = shallow(
      <NewsRedirectController
        language={language}
        city={city}
        cities={cities}
        type={TUNEWS_ROUTE}
        redirect={() => {}}
        >
        <div>dummy child</div>
      </NewsRedirectController>
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('should map state to props', () => {
    const location = createLocation({
      payload: { city: city, language: language },
      type: TUNEWS_ROUTE
    })

    const mockStore = configureMockStore()
    const store = mockStore({
      location: location,
      cities: { data: cities }
    })

    const tree = mount(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <ConnectedNewsRedirectController />
        </Provider>
      </ThemeProvider>
    )

    expect(tree.find(NewsRedirectController).props()).toEqual({
      language,
      city,
      type: TUNEWS_ROUTE,
      cities,
      redirect: expect.any(Function)
    })
  })
})
