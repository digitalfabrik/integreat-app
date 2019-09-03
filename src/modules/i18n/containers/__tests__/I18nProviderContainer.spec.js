// @flow

import configureMockStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import I18nProviderContainer from '../I18nProviderContainer'
import * as React from 'react'
import waitForExpect from 'wait-for-expect'
import { render } from '@testing-library/react-native'

jest.mock('@react-native-community/async-storage')
jest.mock('../../../i18n/LanguageDetector')

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
          contentLanguage: 'en_US'
        }
      }])
    })
  })
})
