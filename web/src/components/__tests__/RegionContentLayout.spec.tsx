import { RenderResult } from '@testing-library/react'
import React, { ReactElement } from 'react'

import { RegionModelBuilder } from 'shared/api'

import { mockDimensions } from '../../__mocks__/useDimensions'
import useDimensions from '../../hooks/useDimensions'
import { renderAllRoutes } from '../../testing/render'
import RegionContentLayout from '../RegionContentLayout'

jest.mock('../../hooks/useDimensions')
jest.mock('../Footer', () => () => <div>Footer</div>)
jest.mock('../RegionContentHeader', () => () => <div>RegionContentHeader</div>)
jest.mock('react-i18next')

describe('RegionContentLayout', () => {
  beforeEach(jest.clearAllMocks)
  const { mocked } = jest
  const language = 'de'
  const regionModel = new RegionModelBuilder(1).build()[0]!

  const languageChangePaths = [
    { code: 'de', name: 'Deutsch', path: '/augsburg/de' },
    { code: 'en', name: 'English', path: '/augsburg/en' },
  ]

  const MockNode = () => <div />
  const renderRegionContentLayout = (isLoading: boolean, Toolbar?: ReactElement): RenderResult =>
    renderAllRoutes('/augsburg/de', {
      RegionContentElement: (
        <RegionContentLayout
          Toolbar={Toolbar}
          region={regionModel}
          languageCode={language}
          languageChangePaths={languageChangePaths}
          pageTitle='Test Page'
          isLoading={isLoading}>
          <MockNode />
        </RegionContentLayout>
      ),
    })

  it('should render a toolbar on desktop', () => {
    mocked(useDimensions).mockImplementation(() => ({ ...mockDimensions, mobile: false, desktop: true }))
    const { getByText } = renderRegionContentLayout(false, <div>Toolbar</div>)
    expect(getByText('Toolbar')).toBeTruthy()
  })

  it('should hide the toolbar on mobile', () => {
    mocked(useDimensions).mockImplementation(() => ({ ...mockDimensions, mobile: true }))
    const { queryByText } = renderRegionContentLayout(false, <div>Toolbar</div>)
    expect(queryByText('Toolbar')).toBeFalsy()
  })

  it('should show header and footer if not loading and on a big screen', () => {
    mocked(useDimensions).mockImplementation(() => ({ ...mockDimensions, mobile: false, desktop: true }))
    const { getByText } = renderRegionContentLayout(false)
    expect(getByText('RegionContentHeader')).toBeTruthy()
    expect(getByText('Footer')).toBeTruthy()
  })

  it('should not show footer if not loading and on a small screen', () => {
    mocked(useDimensions).mockImplementation(() => ({ ...mockDimensions, mobile: true }))
    const { getByText } = renderRegionContentLayout(false)
    expect(getByText('RegionContentHeader')).toBeTruthy()
    expect(() => getByText('Footer')).toThrow()
  })

  it('should not show footer if loading', () => {
    mocked(useDimensions).mockImplementation(() => ({ ...mockDimensions, mobile: true }))
    const { getByText } = renderRegionContentLayout(true)
    expect(getByText('RegionContentHeader')).toBeTruthy()
    expect(() => getByText('Footer')).toThrow()
  })
})
