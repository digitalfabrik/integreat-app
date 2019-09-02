// @flow

import { render, queries } from '@testing-library/react-native'
import React from 'react'
import PageDetail from '../PageDetail'
import { queryAllFlex } from '../../../../testing/styleTestingUtils'
import brightTheme from '../../../theme/constants/theme'

describe('PageDetail', () => {
  it('should display the given identifier followed by a colon', () => {
    const { queryByText, container } = render(
      <PageDetail identifier={'Test Identifier'} information={'Some important information'} theme={brightTheme}
                  language={'de'} />,
      {
        queries: { ...queries }
      }
    )
    expect(queryByText('Test Identifier', { exact: false })).toBeTruthy()
    expect(queryByText('Some important information', { exact: false })).toBeTruthy()
    expect(queryAllFlex(container, {})).toSatisfyAll(
      style => style.props.style.some(style => style.flexDirection === 'row')
    )
  })
})
