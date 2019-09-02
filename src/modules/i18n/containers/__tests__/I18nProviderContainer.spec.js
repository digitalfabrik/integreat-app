// @flow

import configureMockStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import I18nProviderContainer from '../I18nProviderContainer'
import React from 'react'
import { render } from '@testing-library/react-native'

const waitForExpect = require('wait-for-expect')

const mockStore = configureMockStore()

describe('I18nProviderContainer', () => {
  it('should pass the right props', async () => {
    const store = mockStore({})
    render(
      <Provider store={store}>
        <I18nProviderContainer>
          <React.Fragment />
        </I18nProviderContainer>
      </Provider>
    )

    await waitForExpect(() => {
      expect(store.getActions()).toEqual([{
        type: 'SET_CONTENT_LANGUAGE',
        params: {
          contentLanguage: 'de'
        }
      }])
    })
  })
})
