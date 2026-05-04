import { fireEvent, Matcher } from '@testing-library/react'
import React from 'react'

import { RegionModelBuilder } from 'shared/api'

import buildConfig from '../../constants/buildConfig'
import { renderWithRouterAndTheme } from '../../testing/render'
import RegionSelector from '../RegionSelector'

jest.mock('react-i18next')
jest.mock('stylis')
jest.mock('shared/api', () => ({
  ...jest.requireActual('shared/api'),
  useLoadAsync: jest.fn(() => ({ data: null, error: null })),
}))

describe('RegionSelector', () => {
  const previousConfig = buildConfig()
  let config = previousConfig

  beforeAll(() => {
    config.featureFlags.developerFriendly = false
  })

  afterAll(() => {
    config = previousConfig
  })

  const regions = new RegionModelBuilder(5).build()
  const region = regions[0]!

  const changeFilterText = (getByPlaceholderText: (id: Matcher) => HTMLElement, filterText: string) => {
    fireEvent.change(getByPlaceholderText(regions[0]!.sortingName), {
      target: {
        value: filterText,
      },
    })
  }

  it('should render skeleton list while loading', () => {
    const { queryByLabelText, getByRole } = renderWithRouterAndTheme(
      <RegionSelector language='de' regions={regions} stickyTop={0} loading />,
    )

    expect(getByRole('list')).toBeTruthy()
    regions.filter(region => !region.live).forEach(region => expect(queryByLabelText(region.name)).toBeFalsy())
  })

  it('should show only live regions', () => {
    const { queryByLabelText } = renderWithRouterAndTheme(
      <RegionSelector language='de' regions={regions} stickyTop={0} loading={false} />,
    )

    regions.filter(region => !region.live).forEach(region => expect(queryByLabelText(region.name)).toBeFalsy())
    regions.filter(region => region.live).forEach(region => expect(queryByLabelText(region.name)).toBeTruthy())
  })

  it('should show live regions matching filter text', () => {
    const { queryByLabelText, getByPlaceholderText } = renderWithRouterAndTheme(
      <RegionSelector language='de' regions={regions} stickyTop={0} loading={false} />,
    )

    changeFilterText(getByPlaceholderText, region.name.slice(5, 9))

    expect(queryByLabelText(region.name)).toBeTruthy()
    regions.slice(1).forEach(region => expect(queryByLabelText(region.name)).toBeFalsy())
  })

  it('should not show any region if filter text does not match', () => {
    const { queryByLabelText, getByPlaceholderText } = renderWithRouterAndTheme(
      <RegionSelector language='de' regions={regions} stickyTop={0} loading={false} />,
    )

    changeFilterText(getByPlaceholderText, 'Does not exist')

    regions.forEach(region => expect(queryByLabelText(region.name)).toBeFalsy())
    expect(getByPlaceholderText(regions[0]!.sortingName)).toBeTruthy()
  })

  it('should not show any region if filter text does not match a live region', () => {
    const { queryByLabelText, getByPlaceholderText } = renderWithRouterAndTheme(
      <RegionSelector language='de' regions={regions} stickyTop={0} loading={false} />,
    )

    changeFilterText(getByPlaceholderText, 'oldtown')

    regions.forEach(region => expect(queryByLabelText(region.name)).toBeFalsy())
  })

  it('should show all non-live regions if filter text is "wirschaffendas"', () => {
    const { queryByLabelText, getByPlaceholderText } = renderWithRouterAndTheme(
      <RegionSelector language='de' regions={regions} stickyTop={0} loading={false} />,
    )

    changeFilterText(getByPlaceholderText, 'wirschaffendas')

    regions.filter(region => !region.live).forEach(region => expect(queryByLabelText(region.name)).toBeTruthy())
    regions.filter(region => region.live).forEach(region => expect(queryByLabelText(region.name)).toBeFalsy())
  })
})
