import React from 'react'

import { renderWithRouterAndTheme } from '../../testing/render'
import PageDetail from '../PageDetail'

describe('PageDetail', () => {
  const identifier = 'Date'
  const information = 'May 22, 2020 1:00 AM'
  const path = '/testumgebung/de/location1'

  it('should render correctly without a path', () => {
    const { getByText } = renderWithRouterAndTheme(<PageDetail identifier={identifier} information={information} />)
    expect(getByText(`${identifier}:`)).toBeDefined()
    expect(getByText(information)).toBeDefined()
  })

  it('should render correctly with a path', () => {
    const { getByText, getByRole } = renderWithRouterAndTheme(
      <PageDetail identifier={identifier} information={information} pathToInformation={path} />,
    )
    expect(getByText(`${identifier}:`)).toBeDefined()
    expect(getByText(information)).toBeDefined()
    expect(getByRole('link', { name: information })).toHaveAttribute('href', path)
  })
})
