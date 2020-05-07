// @flow

import React from 'react'
import { mount, shallow } from 'enzyme'
import moment from 'moment-timezone'
import type Moment from 'moment'
import configureMockStore from 'redux-mock-store'
import ConnectedTunewsListPage, { TunewsListPage } from '../TunewsList'
import { CityModel, TunewsModel } from '@integreat-app/integreat-api-client'
import { Provider } from 'react-redux'
import createLocation from '../../../../createLocation'
import { TUNEWS_LIST_ROUTE } from '../../../../modules/app/route-configs/TunewsListRouteConfig'
import theme from '../../../../modules/theme/constants/theme'
import { ThemeProvider } from 'styled-components'

describe('TunewsListPage', () => {
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

  const createTunewsItemModel = (id, date: Moment): TunewsModel => new TunewsModel({
    id,
    title: 'Tick bite - What to do?',
    tags: ['8 Gesundheit'],
    date: date,
    content: 'In summer there are often ticks in forest and meadows with high grass. These are very small animals. They feed on the blood of people or animals they sting, like mosquitoes. But they stay in the skin longer and can transmit dangerous diseases. If you have been in high grass, you should search your body very thoroughly for ticks. They like to sit in the knees, armpits or in the groin area. If you discover a tick in your skin, you should carefully pull it out with tweezers without crushing it. If the sting inflames, you must see a doctor. tünews INTERNATIONAL',
    eNewsNo: 'tun0000009902'
  })

  const tunewsItem1 = createTunewsItemModel(1,
    moment.tz('2020-01-20 12:04:22+00:00', 'GMT'))
  const tunewsItem2 = createTunewsItemModel(2,
    moment.tz('2020-01-24 10:05:22+00:00', 'GMT'))
  const tunewsItem3 = createTunewsItemModel(3,
    moment.tz('2020-01-22 11:06:22+00:00', 'GMT'))

  const tunewsList = [tunewsItem1, tunewsItem2, tunewsItem3]
  const city = 'augsburg'
  const language = 'en'
  const t = (key: ?string): string => key || ''

  it('should match snapshot and render TunewsList', () => {
    const wrapper = shallow(
      <TunewsListPage
        tunewsList={tunewsList}
        language={language}
        city={city}
        path='/path/to/route'
        t={t}
        hasMore
        isFetchingFirstTime={false}
        isFetching={false}
        resetTunews={() => {}}
        fetchTunews={() => {}}
        cities={cities}
      />
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('should map state to props', () => {
    const location = createLocation({
      payload: { city: city, language: language },
      pathname: '/augsburg/en/news/tu-news',
      type: TUNEWS_LIST_ROUTE
    })

    const mockStore = configureMockStore()
    const store = mockStore({
      location: location,
      cities: { data: cities },
      tunewsList: { data: [], hasMore: false }
    })

    const tree = mount(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <ConnectedTunewsListPage tunewsList={tunewsList} cities={cities} />
        </Provider>
      </ThemeProvider>
    )

    expect(tree.find(TunewsListPage).props()).toEqual({
      tunewsList,
      cities,
      language,
      path: '/augsburg/en/news/tu-news',
      city,
      hasMore: false,
      isFetching: undefined,
      isFetchingFirstTime: undefined,
      t: expect.any(Function),
      i18n: expect.anything(),
      fetchTunews: expect.any(Function),
      resetTunews: expect.any(Function)
    })
  })

  moment.tz.setDefault()
})
