import React from 'react'

import { renderWithRouterAndTheme } from '../../testing/render'
import PageDetail from '../PageDetail'

describe('PageDetail', () => {
  const identifier = 'Date'
  const information = 'May 22, 2020 1:00 AM'

  it('should render correctly', () => {
    const { getByText } = renderWithRouterAndTheme(<PageDetail identifier={identifier} information={information} />)
    expect(getByText(`${identifier}:`)).toBeDefined()
    expect(getByText(information)).toBeDefined()
  })
})
