import { NavigationContainer } from '@react-navigation/native'
import React from 'react'

import render from '../../testing/render'
import PageDetail from '../PageDetail'

describe('PageDetail', () => {
  it('should display the given identifier followed by a colon', () => {
    const { queryAllByText, queryByText } = render(
      <NavigationContainer>
        <PageDetail identifier='Test Identifier' information='Some important information' language='de' />
      </NavigationContainer>,
    )
    expect(queryAllByText(/Test Identifier/)).toBeTruthy()
    expect(queryByText(/Some important information/)).toBeTruthy()
  })
})
