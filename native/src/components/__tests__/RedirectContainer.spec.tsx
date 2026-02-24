import { waitFor } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'

import { REDIRECT_ROUTE } from 'shared'

import useNavigateToDeepLink from '../../hooks/useNavigateToDeepLink'
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
    render(<RedirectContainer route={route} />)
    await waitFor(() => {
      expect(navigateToDeepLink).toHaveBeenCalledTimes(1)
      expect(navigateToDeepLink).toHaveBeenCalledWith(url)
    })
  })
})
