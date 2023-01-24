import { mocked } from 'jest-mock'
import React from 'react'
import waitForExpect from 'wait-for-expect'

import { REDIRECT_ROUTE } from 'api-client'

import useNavigateToDeepLink from '../../hooks/useNavigateToDeepLink'
import createNavigationScreenPropMock from '../../testing/createNavigationPropMock'
import render from '../../testing/render'
import RedirectContainer from '../RedirectContainer'

jest.mock('../../hooks/useNavigateToDeepLink')
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
  const navigateToDeepLink = jest.fn()
  mocked(useNavigateToDeepLink).mockImplementation(() => navigateToDeepLink)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should call navigate to deep link on mount', async () => {
    render(<RedirectContainer route={route} navigation={navigation} />)
    await waitForExpect(() => {
      expect(navigateToDeepLink).toHaveBeenCalledTimes(1)
      expect(navigateToDeepLink).toHaveBeenCalledWith(url)
    })
  })
})
