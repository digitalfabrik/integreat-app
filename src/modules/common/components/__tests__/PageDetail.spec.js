// @flow

import { render } from '@testing-library/react-native'
import React from 'react'
import PageDetail from '../PageDetail'
import { queryAllFlex } from '../../../../testing/customQueries'
import brightTheme from '../../../theme/constants/theme'

describe('PageDetail', () => {
  it('should display the given identifier followed by a colon', () => {
    const { queryByText, container } = render(
      <PageDetail identifier={'Test Identifier'} information={'Some important information'} theme={brightTheme}
                  language={'de'} />
    )
    expect(queryByText('Test Identifier', { exact: false })).toBeTruthy()
    expect(queryByText('Some important information', { exact: false })).toBeTruthy()

    // $FlowFixMe https://github.com/flow-typed/flow-typed/issues/948
    expect(queryAllFlex(container)).toHaveDirection()
  })
})
