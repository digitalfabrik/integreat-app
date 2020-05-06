// @flow

import React from 'react'
import { mount, shallow } from 'enzyme'
import moment from 'moment-timezone'
import { ThemeProvider } from 'styled-components'

import ConnectedLocalNewsDetails, { LocalNewsDetailsPage } from '../LocalNewsDetails'
import { LocalNewsModel } from '@integreat-app/integreat-api-client'
import createReduxStore from '../../../../modules/app/createReduxStore'
import { Provider } from 'react-redux'
import createLocation from '../../../../createLocation'
import { LOCAL_NEWS_DETAILS_ROUTE } from '../../../../modules/app/route-configs/LocalNewsDetailsRouteConfig'
import theme from '../../../../modules/theme/constants/theme'

describe('LocalNewsDetailsPage', () => {
  const createNewsItemModel = (date: Moment): LocalNewsModel =>
    new LocalNewsModel({
      id: 1,
      title: 'Tick bite - What to do?',
      timestamp: date,
      message:
      'In summer there are often ticks in forest and meadows with high grass. These are very small animals. They feed on the blood of people or animals they sting, like mosquitoes. But they stay in the skin longer and can transmit dangerous diseases. If you have been in high grass, you should search your body very thoroughly for ticks. They like to sit in the knees, armpits or in the groin area. If you discover a tick in your skin, you should carefully pull it out with tweezers without crushing it. If the sting inflames, you must see a doctor.'
    })

  const localNewsDetails = createNewsItemModel(
    moment.tz('2020-03-20 17:50:00', 'GMT')
  )

  const city = 'augsburg'
  const language = 'en'
  const t = (key: ?string): string => key || ''
  const path = '/augsburg/en/news/local/1'

  it('should match snapshot and render NewsPage', () => {
    const wrapper = shallow(
      <LocalNewsDetailsPage
        localNewsDetails={localNewsDetails}
        city={city}
        language={language}
        t={t}
        path={path}
      />
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('should map state to props', () => {
    const location = createLocation({
      payload: { city: city, language: language },
      pathname: path,
      type: LOCAL_NEWS_DETAILS_ROUTE
    })
    const store = createReduxStore()
    store.getState().location = location

    const tree = mount(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <ConnectedLocalNewsDetails localNewsDetails={localNewsDetails} />
        </Provider>
      </ThemeProvider>
    )

    expect(tree.find(LocalNewsDetailsPage).props()).toEqual({
      city,
      language,
      path,
      localNewsDetails,
      dispatch: expect.any(Function)
    })
  })

  moment.tz.setDefault()
})
