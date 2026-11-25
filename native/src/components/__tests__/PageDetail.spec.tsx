import React from 'react'

import render from '../../testing/render'
import PageDetail from '../PageDetail'

describe('PageDetail', () => {
  it('should display the given identifier followed by a colon', async () => {
    const { queryAllByText, queryByText } = await render(
      <PageDetail identifier='Test Identifier' information='Some important information' language='de' />,
    )
    expect(queryAllByText(/Test Identifier/)).toBeTruthy()
    expect(queryByText(/Some important information/)).toBeTruthy()
  })
})
