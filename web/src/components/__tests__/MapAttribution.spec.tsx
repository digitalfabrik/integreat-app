import { fireEvent } from '@testing-library/react'
import React from 'react'

import { openStreeMapCopyright } from 'api-client/src'

import { renderWithRouterAndTheme } from '../../testing/render'
import MapAttribution from '../MapAttribution'

describe('MapAttribution', () => {
  it('should render copyright icon on mobile', () => {
    const { icon } = openStreeMapCopyright
    const { getByText } = renderWithRouterAndTheme(<MapAttribution initialExpanded={false} />)
    expect(getByText(icon)).toBeTruthy()
  })

  it('should render contribution link by clicking on icon on mobile', () => {
    const { icon, linkText, url } = openStreeMapCopyright
    const { getByText } = renderWithRouterAndTheme(<MapAttribution initialExpanded={false} />)
    expect(getByText(icon)).toBeTruthy()
    fireEvent.click(getByText(icon))
    expect(getByText(linkText)).toBeTruthy()
    expect(getByText(linkText)).toHaveAttribute('href', url)
  })

  it('should render contribution link on desktop', () => {
    const { url, linkText } = openStreeMapCopyright
    const { getByText } = renderWithRouterAndTheme(<MapAttribution initialExpanded />)
    expect(getByText(linkText)).toBeTruthy()
    expect(getByText(linkText)).toHaveAttribute('href', url)
  })
})
