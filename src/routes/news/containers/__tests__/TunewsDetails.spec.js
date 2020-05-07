// @flow

import React from 'react'
import { mount, shallow } from 'enzyme'
import moment from 'moment-timezone'
import type Moment from 'moment'
import configureMockStore from 'redux-mock-store'
import ConnectedTunewsDetailsPage, { TunewsDetailsPage } from '../TunewsDetails'
import { CityModel, TunewsModel } from '@integreat-app/integreat-api-client'
import { Provider } from 'react-redux'
import createLocation from '../../../../createLocation'
import { TUNEWS_LIST_ROUTE } from '../../../../modules/app/route-configs/TunewsListRouteConfig'
import theme from '../../../../modules/theme/constants/theme'
import { ThemeProvider } from 'styled-components'

describe('TunewsDetailsPage', () => {
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

  const tunewsElementDetails = createTunewsItemModel(1,
    moment.tz('2020-01-20 12:04:22+00:00', 'GMT'))

  const city = 'augsburg'
  const language = 'en'
  const t = (key: ?string): string => key || ''

  it('should match snapshot and render TunewsDetailsPage', () => {
    const wrapper = shallow(
      <TunewsDetailsPage
        tunewsElementDetails={tunewsElementDetails}
        language={language}
        city={city}
        t={t}
        path='/path/to/route'
      />
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('should map state to props', () => {
    const location = createLocation({
      payload: { city: city, language: language },
      pathname: '/augsburg/en/news/tu-news/1',
      type: TUNEWS_LIST_ROUTE
    })

    const mockStore = configureMockStore()
    const store = mockStore({
      location: location,
      cities: { data: cities }
    })

    const tree = mount(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <ConnectedTunewsDetailsPage tunewsElementDetails={tunewsElementDetails} />
        </Provider>
      </ThemeProvider>
    )

    expect(tree.find(TunewsDetailsPage).props()).toEqual({
      tunewsElementDetails,
      language,
      path: '/augsburg/en/news/tu-news/1',
      city,
      t: expect.any(Function),
      i18n: expect.anything(),
      dispatch: expect.any(Function)
    })
  })

  moment.tz.setDefault()
})
