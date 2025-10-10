import React from 'react'

import { openStreeMapCopyright } from 'shared'

import { renderWithRouterAndTheme } from '../../testing/render'
import MapAttribution from '../MapAttribution'

describe('MapAttribution', () => {
  it('should render contribution link', () => {
    const { url, linkText } = openStreeMapCopyright
    const { getByText } = renderWithRouterAndTheme(<MapAttribution />)
    expect(getByText(linkText)).toBeTruthy()
    expect(getByText(linkText)).toHaveAttribute('href', url)
  })
})
