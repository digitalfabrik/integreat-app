import { fireEvent } from '@testing-library/react'
import React from 'react'

import { openStreeMapCopyright } from 'api-client/src'

import { renderWithRouterAndTheme } from '../../testing/render'
import MapAttribution from '../MapAttribution'

describe('MapAttribution', () => {
  it('should render copyright icon', () => {
    const { icon } = openStreeMapCopyright
    const { getByText } = renderWithRouterAndTheme(<MapAttribution />)
    expect(getByText(icon)).toBeTruthy()
  })

  it('should render contribution link by clicking on copyright icon', () => {
    const { url, icon, linkText } = openStreeMapCopyright
    const { getByText } = renderWithRouterAndTheme(<MapAttribution />)
    expect(getByText(icon)).toBeTruthy()
    fireEvent.click(getByText(icon))
    expect(getByText(linkText)).toHaveAttribute('href', url)
  })
})
