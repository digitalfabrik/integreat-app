// @flow

import * as React from 'react'
import { render } from '@testing-library/react-native'
import RedirectContainer from '../RedirectContainer'
import waitForExpect from 'wait-for-expect'
import { Provider } from 'react-redux'
import createNavigationScreenPropMock from '../../../../testing/createNavigationPropMock'
import { REDIRECT_ROUTE } from 'api-client'
import navigateToDeepLink from '../../../navigation/navigateToDeepLink'
import configureMockStore from 'redux-mock-store'

jest.mock('../../../navigation/navigateToDeepLink')
jest.mock('../../../i18n/NativeLanguageDetector')
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ i18n: { language: 'ckb' } })
}))

describe('RedirectContainer', () => {
  const url = 'https://example.com/custom/url'
  const navigation = createNavigationScreenPropMock()
  const route = { key: 'route-id-0', params: { url }, name: REDIRECT_ROUTE }
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
