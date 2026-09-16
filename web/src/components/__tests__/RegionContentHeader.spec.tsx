import React from 'react'

import { RegionModelBuilder } from 'shared/api'

import { mockDimensions } from '../../__mocks__/useDimensions'
import useDimensions from '../../hooks/useDimensions'
import { renderWithRouterAndTheme } from '../../testing/render'
import RegionContentHeader from '../RegionContentHeader'

jest.mock('../../hooks/useDimensions', () => jest.fn(() => mockDimensions))

describe('RegionContentHeader', () => {
  const { mocked } = jest
  const regionModel = new RegionModelBuilder(1).build()[0]!

  const languageChangePaths = [
    { code: 'de', name: 'Deutsch', path: '/augsburg/de' },
    { code: 'en', name: 'English', path: '/augsburg/en' },
  ]
  const languageCode = 'de'

  const renderRegionContentHeader = () =>
    renderWithRouterAndTheme(
      <RegionContentHeader
        regionModel={regionModel}
        languageCode={languageCode}
        languageChangePaths={languageChangePaths}
        category={undefined}
        pageTitle='Test Page'
      />,
    )

  it('should render correctly', () => {
    mocked(useDimensions).mockImplementation(() => ({ ...mockDimensions, desktop: true, mobile: false }))
    const { getAllByText, getByText, getByLabelText } = renderRegionContentHeader()
    expect(getByText(regionModel.name)).toBeTruthy()
    expect(getAllByText('Deutsch')).toBeTruthy()
    expect(getByText('events:title')).toBeTruthy()
    expect(getByLabelText('common:labels.menu')).toBeTruthy()
  })

  it('should hide navigation tabs on mobile', () => {
    mocked(useDimensions).mockImplementation(() => ({ ...mockDimensions, mobile: true }))
    const { getByText, getByLabelText, queryByText } = renderRegionContentHeader()
    expect(getByText(regionModel.name)).toBeTruthy()
    expect(getByLabelText('languages:change')).toBeTruthy()
    expect(getByLabelText('common:labels.menu')).toBeTruthy()
    expect(queryByText('events:title')).toBeFalsy()
  })
})
