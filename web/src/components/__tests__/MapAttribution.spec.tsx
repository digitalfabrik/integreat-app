import React from 'react'

import { openStreetMapCopyright } from 'shared'

import { renderWithRouterAndTheme } from '../../testing/render'
import MapAttribution from '../MapAttribution'

describe('MapAttribution', () => {
  it('should render contribution link', () => {
    const { url, linkText } = openStreetMapCopyright
    const { getByText } = renderWithRouterAndTheme(<MapAttribution />)
    expect(getByText(linkText)).toBeTruthy()
    expect(getByText(linkText)).toHaveAttribute('href', url)
  })
})
