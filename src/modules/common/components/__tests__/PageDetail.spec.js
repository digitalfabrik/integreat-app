// @flow

import { render } from '@testing-library/react-native'
import React from 'react'
import PageDetail from '../PageDetail'
import brightTheme from '../../../theme/constants/theme'
import { I18nManager } from 'react-native'
import { expectToHaveForwardDirection, expectToHaveReverseDirection } from '../../../../testing/jest-extend-utils'

describe('PageDetail', () => {
  it('should display the given identifier followed by a colon', () => {
    const { queryByText } = render(
      <PageDetail identifier={'Test Identifier'} information={'Some important information'} theme={brightTheme}
                  language={'de'} />
    )
    expect(queryByText('Test Identifier', { exact: false })).toBeTruthy()
    expect(queryByText('Some important information', { exact: false })).toBeTruthy()
  })

  describe('should manually reverse if content language doesnt have the same direction as system language', () => {
    it('if system language is not rtl', () => {
      I18nManager.forceRTL(false)

      const { container } = render(
        <PageDetail identifier={'Test Identifier'} information={'Some important information'} theme={brightTheme}
                    language={'de'} />
      )

      expectToHaveForwardDirection(container)

      const { container: arabicContainer } = render(
        <PageDetail identifier={'Test Identifier'} information={'Some important information'} theme={brightTheme}
                    language={'ar'} />
      )

      expectToHaveReverseDirection(arabicContainer)
    })

    it('if system language is rtl', () => {
      I18nManager.forceRTL(true)

      const { container } = render(
        <PageDetail identifier={'Test Identifier'} information={'Some important information'} theme={brightTheme}
                    language={'de'} />
      )

      expectToHaveReverseDirection(container)

      const { container: arabicContainer } = render(
        <PageDetail identifier={'Test Identifier'} information={'Some important information'} theme={brightTheme}
                    language={'ar'} />
      )

      expectToHaveForwardDirection(arabicContainer)
    })
  })
})
