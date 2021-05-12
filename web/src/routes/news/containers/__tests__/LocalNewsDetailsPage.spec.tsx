// @flow

import React from 'react'
import { mount } from 'enzyme'
import moment from 'moment'
import type Moment from 'moment'
import { ThemeProvider } from 'styled-components'

import ConnectedLocalNewsDetailsPage, { LocalNewsDetailsPage } from '../LocalNewsDetailsPage'
import { LocalNewsModel } from 'api-client'
import { Provider } from 'react-redux'
import createLocation from '../../../../createLocation'
import { LOCAL_NEWS_DETAILS_ROUTE } from '../../../../modules/app/route-configs/LocalNewsDetailsRouteConfig'
import theme from '../../../../modules/theme/constants/theme'
import configureMockStore from 'redux-mock-store'
import CityModelBuilder from 'api-client/src/testing/CityModelBuilder'

jest.mock('redux-first-router-link')

describe('LocalNewsDetailsPage', () => {
  const cities = new CityModelBuilder(2).build()

  const createNewsItemModel = (date: Moment): LocalNewsModel =>
    new LocalNewsModel({
      id: 1,
      title: 'Tick bite - What to do?',
      timestamp: date,
      message:
        'In summer there are often ticks in forest and meadows with high grass. These are very small animals. They feed on the blood of people or animals they sting, like mosquitoes. But they stay in the skin longer and can transmit dangerous diseases. If you have been in high grass, you should search your body very thoroughly for ticks. They like to sit in the knees, armpits or in the groin area. If you discover a tick in your skin, you should carefully pull it out with tweezers without crushing it. If the sting inflames, you must see a doctor.'
    })

  const localNewsElement = createNewsItemModel(moment('2020-03-20T17:50:00.000Z'))

  const city = 'augsburg'
  const language = 'en'
  const path = '/augsburg/en/news/local/1'
  const id = 1

  it('should map state to props', () => {
    const location = createLocation({
      payload: { city: city, language: language, id },
      pathname: path,
      type: LOCAL_NEWS_DETAILS_ROUTE
    })

    const mockStore = configureMockStore()
    const store = mockStore({
      location: location,
      cities: { data: cities }
    })
    store.getState().location = location

    const tree = mount(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <ConnectedLocalNewsDetailsPage localNewsElement={localNewsElement} />
        </Provider>
      </ThemeProvider>
    )

    expect(tree.find(LocalNewsDetailsPage).props()).toEqual({
      city,
      language,
      id,
      cities,
      localNewsElement,
      dispatch: expect.any(Function)
    })
  })
})
