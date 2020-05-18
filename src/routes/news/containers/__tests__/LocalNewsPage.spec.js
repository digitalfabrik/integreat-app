// @flow

import React from 'react'
import { mount, shallow } from 'enzyme'
import moment from 'moment-timezone'
import { ThemeProvider } from 'styled-components'

import ConnectedLocalNewsPage, { LocalNewsPage } from '../LocalNewsPage'
import { LocalNewsModel, CityModel } from '@integreat-app/integreat-api-client'
import createReduxStore from '../../../../modules/app/createReduxStore'
import { Provider } from 'react-redux'
import createLocation from '../../../../createLocation'
import { LOCAL_NEWS_ROUTE } from '../../../../modules/app/route-configs/LocalNewsRouteConfig'
import theme from '../../../../modules/theme/constants/theme'

describe('LocalNewsPage', () => {
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
      latitude: null,
      longitude: null,
      aliases: null
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

  const localNews = [new LocalNewsModel({
    id: 1,
    title: 'Tick bite - What to do?',
    timestamp: moment.tz('2020-03-20 17:50:00', 'GMT'),
    message:
    'In summer there are often ticks in forest and meadows with high grass. These are very small animals. They feed on the blood of people or animals they sting, like mosquitoes. But they stay in the skin longer and can transmit dangerous diseases. If you have been in high grass, you should search your body very thoroughly for ticks. They like to sit in the knees, armpits or in the groin area. If you discover a tick in your skin, you should carefully pull it out with tweezers without crushing it. If the sting inflames, you must see a doctor.'
  }), new LocalNewsModel({
    id: 2,
    title: 'Tick bite - What to do?',
    timestamp: moment.tz('2020-03-25 17:50:00', 'GMT'),
    message:
    'In summer there are often ticks in forest and meadows with high grass. These are very small animals. They feed on the blood of people or animals they sting, like mosquitoes. But they stay in the skin longer and can transmit dangerous diseases. If you have been in high grass, you should search your body very thoroughly for ticks. They like to sit in the knees, armpits or in the groin area. If you discover a tick in your skin, you should carefully pull it out with tweezers without crushing it. If the sting inflames, you must see a doctor.'
  })]

  const city = 'augsburg'
  const language = 'en'
  const t = (key: ?string): string => key || ''

  it('should match snapshot and render LocalNewsPage', () => {
    const wrapper = shallow(
      <LocalNewsPage
        localNews={localNews}
        city={city}
        cities={cities}
        areCitiesFetching={false}
        language={language}
        path='/path/to/page'
        t={t}
      />
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('should map state to props', () => {
    const location = createLocation({
      payload: { city: city, language: language },
      pathname: '/augsburg/en/news/local/',
      type: LOCAL_NEWS_ROUTE
    })
    const store = createReduxStore()
    store.getState().location = location
    store.getState().cities = { data: cities, isFetching: false }
    store.getState().localNews = { data: localNews }

    const tree = mount(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <ConnectedLocalNewsPage localNews={localNews} cities={cities} />
        </Provider>
      </ThemeProvider>
    )

    expect(tree.find(LocalNewsPage).props()).toEqual({
      city,
      cities,
      areCitiesFetching: false,
      language,
      path: '/augsburg/en/news/local/',
      localNews,
      t: expect.any(Function),
      i18n: expect.anything(),
      dispatch: expect.any(Function)
    })
  })
})
