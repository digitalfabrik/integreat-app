// @flow

import React from 'react'
import { mount } from 'enzyme'
import moment from 'moment'
import type Moment from 'moment'
import configureMockStore from 'redux-mock-store'
import ConnectedTunewsPage, { TunewsPage } from '../TunewsPage'
import { CityModel, TunewsModel, Payload } from '@integreat-app/integreat-api-client'
import { Provider } from 'react-redux'
import createLocation from '../../../../createLocation'
import { TUNEWS_ROUTE } from '../../../../modules/app/route-configs/TunewsRouteConfig'
import theme from '../../../../modules/theme/constants/theme'
import { ThemeProvider } from 'styled-components'

describe('TunewsPage', () => {
  const cities = [
    new CityModel({
      name: 'Augsburg',
      code: 'augsburg',
      live: true,
      eventsEnabled: true,
      offersEnabled: true,
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
      offersEnabled: false,
      pushNotificationsEnabled: false,
      tunewsEnabled: false,
      sortingName: 'Regensburg',
      prefix: 'Stadt',
      latitude: null,
      longitude: null,
      aliases: null
    })
  ]

  const createTunewsItemModel = (id, date: Moment): TunewsModel => new TunewsModel({
    id,
    title: 'Tick bite - What to do?',
    tags: ['8 Gesundheit'],
    date: date,
    content: 'In summer there are often ticks in forest and meadows with high grass. These are very small animals. They feed on the blood of people or animals they sting, like mosquitoes. But they stay in the skin longer and can transmit dangerous diseases. If you have been in high grass, you should search your body very thoroughly for ticks. They like to sit in the knees, armpits or in the groin area. If you discover a tick in your skin, you should carefully pull it out with tweezers without crushing it. If the sting inflames, you must see a doctor. tünews INTERNATIONAL',
    eNewsNo: 'tun0000009902'
  })

  const tunewsItem1 = createTunewsItemModel(1, moment('2020-01-20T12:04:22.000Z'))
  const tunewsItem2 = createTunewsItemModel(2, moment('2020-01-24T10:05:22.000Z'))
  const tunewsItem3 = createTunewsItemModel(3, moment('2020-01-22T11:06:22.000Z'))

  const tunews = [tunewsItem1, tunewsItem2, tunewsItem3]
  const city = 'augsburg'
  const language = 'en'

  it('should map state to props', () => {
    const location = createLocation({
      payload: { city: city, language: language },
      pathname: '/augsburg/en/news/tu-news',
      type: TUNEWS_ROUTE
    })

    const mockStore = configureMockStore()
    const store = mockStore({
      location: location,
      cities: { data: cities, isFetching: false },
      tunews: { allData: tunews, hasMore: false, payload: new Payload(false, null, []) }
    })

    const tree = mount(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <ConnectedTunewsPage cities={cities} />
        </Provider>
      </ThemeProvider>
    )

    expect(tree.find(TunewsPage).props()).toEqual({
      tunews,
      cities,
      language,
      path: '/augsburg/en/news/tu-news',
      city,
      hasMore: false,
      isFetching: false,
      t: expect.any(Function),
      i18n: expect.anything(),
      fetchTunews: expect.any(Function)
    })
  })
})
