// @flow

import React from 'react'
import { mount } from 'enzyme'
import moment from 'moment'
import { ThemeProvider } from 'styled-components'

import ConnectedLocalNewsPage, { LocalNewsPage } from '../LocalNewsPage'
import { LocalNewsModel, Payload } from 'api-client'
import createReduxStore from '../../../../modules/app/createReduxStore'
import { Provider } from 'react-redux'
import createLocation from '../../../../createLocation'
import { LOCAL_NEWS_ROUTE } from '../../../../modules/app/route-configs/LocalNewsRouteConfig'
import theme from '../../../../modules/theme/constants/theme'
import CityModelBuilder from 'api-client/src/testing/CityModelBuilder'

jest.mock('react-i18next')

describe('LocalNewsPage', () => {
  const cities = new CityModelBuilder(2).build()

  const localNews = [new LocalNewsModel({
    id: 1,
    title: 'Tick bite - What to do?',
    timestamp: moment('2020-03-20T17:50:00.000Z'),
    message:
      'In summer there are often ticks in forest and meadows with high grass. These are very small animals. They feed on the blood of people or animals they sting, like mosquitoes. But they stay in the skin longer and can transmit dangerous diseases. If you have been in high grass, you should search your body very thoroughly for ticks. They like to sit in the knees, armpits or in the groin area. If you discover a tick in your skin, you should carefully pull it out with tweezers without crushing it. If the sting inflames, you must see a doctor.'
  }), new LocalNewsModel({
    id: 2,
    title: 'Tick bite - What to do?',
    timestamp: moment('2020-03-25T17:50:00.000Z'),
    message:
      'In summer there are often ticks in forest and meadows with high grass. These are very small animals. They feed on the blood of people or animals they sting, like mosquitoes. But they stay in the skin longer and can transmit dangerous diseases. If you have been in high grass, you should search your body very thoroughly for ticks. They like to sit in the knees, armpits or in the groin area. If you discover a tick in your skin, you should carefully pull it out with tweezers without crushing it. If the sting inflames, you must see a doctor.'
  })]

  const city = 'augsburg'
  const language = 'en'

  it('should map state to props', () => {
    const location = createLocation({
      payload: { city: city, language: language },
      pathname: '/augsburg/en/news/local/',
      type: LOCAL_NEWS_ROUTE
    })
    const store = createReduxStore()
    store.getState().location = location
    store.getState().cities = new Payload(false, null, cities)
    store.getState().localNews = new Payload(false, null, localNews)

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
      language,
      path: '/augsburg/en/news/local/',
      localNews,
      t: expect.any(Function),
      i18n: expect.anything()
    })
  })
})
