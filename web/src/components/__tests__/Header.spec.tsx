import { mocked } from 'jest-mock'
import React from 'react'

import useWindowDimensions from '../../hooks/useWindowDimensions'
import { renderWithRouterAndTheme } from '../../testing/render'
import { mockWindowDimensions } from '../../testing/utils'
import { Header } from '../Header'

jest.mock('../../hooks/useWindowDimensions')
jest.mock('react-inlinesvg')
jest.mock('react-i18next')

describe('Header', () => {
  beforeEach(jest.clearAllMocks)
  const cityName = 'TestCity'

  it('should render correctly', () => {
    mocked(useWindowDimensions).mockImplementation(() => ({ ...mockWindowDimensions, mobile: true }))
    const { getByText } = renderWithRouterAndTheme(
      <Header logoHref='/random_route' actionItems={[]} cityName={cityName} language='de' />,
    )
    expect(getByText(cityName)).toBeDefined()
  })
})
