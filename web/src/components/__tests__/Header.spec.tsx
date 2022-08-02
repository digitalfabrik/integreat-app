import React from 'react'

import { renderWithBrowserRouter } from '../../testing/render'
import { Header } from '../Header'

describe('Header', () => {
  it('should render correctly', () => {
    const cityName = 'TestCity'

    const { getByText } = renderWithBrowserRouter(
      <Header logoHref='/random_route' actionItems={[]} navigationItems={[]} viewportSmall cityName={cityName} />,
      { wrapWithTheme: true }
    )
    expect(getByText(cityName)).toBeDefined()
  })
})
