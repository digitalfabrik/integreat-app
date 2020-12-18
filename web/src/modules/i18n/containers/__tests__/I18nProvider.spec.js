// @flow

import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import { render, act, screen, waitFor } from '@testing-library/react'
import I18nProvider from '../I18nProvider'
import createLocation from '../../../../createLocation'
import { LOCAL_NEWS_DETAILS_ROUTE } from '../../../app/route-configs/LocalNewsDetailsRouteConfig'

const mockStore = configureMockStore()

describe('I18nProvider', () => {
  it('should choose the default language', async () => {
    const location = createLocation({
      payload: {
        city: 'augsburg',
        language: 'ar',
        id: 1
      },
      pathname: '/',
      type: LOCAL_NEWS_DETAILS_ROUTE
    })

    const store = mockStore({
      location: location
    })

    act(() => {
      render(<Provider store={store}><I18nProvider>Hello</I18nProvider></Provider>)
    })

    await waitFor(() => screen.getByTestId('direction'))

    expect(screen.getByTestId('direction')).toHaveStyle({ direction: 'rtl' })
  })
})
