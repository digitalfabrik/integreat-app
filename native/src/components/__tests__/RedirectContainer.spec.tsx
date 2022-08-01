import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import waitForExpect from 'wait-for-expect'

import { REDIRECT_ROUTE } from 'api-client'

import navigateToDeepLink from '../../navigation/navigateToDeepLink'
import createNavigationScreenPropMock from '../../testing/createNavigationPropMock'
import render from '../../testing/render'
import RedirectContainer from '../RedirectContainer'

jest.mock('../../navigation/navigateToDeepLink')
jest.mock('../../utils/NativeLanguageDetector')
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: {
      language: 'ckb',
    },
  }),
}))
describe('RedirectContainer', () => {
  const url = 'https://example.com/custom/url'
  const navigation = createNavigationScreenPropMock()
  const route = {
    key: 'route-id-0',
    params: {
      url,
    },
    name: REDIRECT_ROUTE,
  }
  const language = 'ckb'
  const mockStore = configureMockStore()
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('should fetch navigate to deep link on mount', async () => {
    render(
      <Provider store={mockStore({})}>
        <RedirectContainer route={route} navigation={navigation} />
      </Provider>
    )
    await waitForExpect(() => {
      expect(navigateToDeepLink).toHaveBeenCalledTimes(1)
      expect(navigateToDeepLink).toHaveBeenCalledWith(expect.any(Function), navigation, url, language)
    })
  })
})
