import { mocked } from 'jest-mock'
import React from 'react'

import { mockDimensions } from '../../__mocks__/useDimensions'
import useDimensions from '../../hooks/useDimensions'
import { renderWithRouterAndTheme } from '../../testing/render'
import { Header } from '../Header'

jest.mock('../../hooks/useDimensions')
jest.mock('react-i18next')

describe('Header', () => {
  beforeEach(jest.clearAllMocks)
  const cityName = 'TestCity'

  it('should render correctly', () => {
    mocked(useDimensions).mockImplementation(() => ({ ...mockDimensions, mobile: true }))
    const { getByText } = renderWithRouterAndTheme(
      <Header logoHref='/random_route' actionItems={[]} cityName={cityName} language='de' />,
    )
    expect(getByText(cityName)).toBeDefined()
  })
})
