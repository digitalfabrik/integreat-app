import React from 'react'

import { mockDimensions } from '../../__mocks__/useDimensions'
import useDimensions from '../../hooks/useDimensions'
import { renderWithRouterAndTheme } from '../../testing/render'
import { Header } from '../Header'

jest.mock('../../hooks/useDimensions')
jest.mock('react-i18next')

describe('Header', () => {
  const { mocked } = jest
  beforeEach(jest.clearAllMocks)
  const regionName = 'TestRegion'

  it('should render correctly', () => {
    mocked(useDimensions).mockImplementation(() => ({ ...mockDimensions, mobile: true }))
    const { getByText } = renderWithRouterAndTheme(
      <Header logoHref='/random_route' actionItems={[]} regionName={regionName} language='de' />,
    )
    expect(getByText(regionName)).toBeDefined()
  })
})
