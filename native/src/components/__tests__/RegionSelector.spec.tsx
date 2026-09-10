import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import { RegionModelBuilder } from 'shared/api'

import render from '../../testing/render'
import RegionSelector from '../RegionSelector'

jest.mock('../../components/NearbyRegions', () => {
  const { Text } = require('react-native-paper')
  return () => <Text>NearbyRegions</Text>
})
jest.mock('../../components/Header')

describe('RegionSelector', () => {
  const regions = new RegionModelBuilder(5).build()
  const region = regions[0]!
  const navigateToDashboard = jest.fn()

  it('should show only live regions', () => {
    const { getByText, queryByText } = render(
      <RegionSelector navigateToDashboard={navigateToDashboard} regions={regions} />,
    )

    expect(getByText('NearbyRegions')).toBeTruthy()
    regions.filter(region => region.live).forEach(region => expect(getByText(region.name)).toBeTruthy())
    regions.filter(region => !region.live).forEach(region => expect(queryByText(region.name)).toBeFalsy())

    expect(navigateToDashboard).not.toHaveBeenCalled()
    fireEvent.press(getByText(region.name))
    expect(navigateToDashboard).toHaveBeenCalledTimes(1)
    expect(navigateToDashboard).toHaveBeenCalledWith(regions[0])
  })

  it('should show live regions matching filter text', () => {
    const { queryByText, getByText, getAllByText, getByPlaceholderText } = render(
      <RegionSelector navigateToDashboard={navigateToDashboard} regions={regions} />,
    )

    fireEvent.changeText(getByPlaceholderText(region.sortingName), region.name.slice(5, 9))

    // The name is rendered in the region entry and as example region of the search description
    expect(getAllByText(region.name, { exact: false })).toHaveLength(2)
    // Highlighter wraps the matching part of the name in its own element
    expect(getByText(region.name.slice(5, 9).trim())).toBeTruthy()
    regions.slice(1).forEach(region => expect(queryByText(region.name)).toBeFalsy())
  })

  it('should not show any region if filter text does not match', () => {
    const { queryByText, getByPlaceholderText } = render(
      <RegionSelector navigateToDashboard={navigateToDashboard} regions={regions} />,
    )

    fireEvent.changeText(getByPlaceholderText(region.sortingName), 'Does not exist')

    regions.forEach(region => expect(queryByText(region.name)).toBeFalsy())
    expect(getByPlaceholderText(region.sortingName)).toBeTruthy()
  })

  it('should not show any region if filter text does not match a live region', () => {
    const { queryByText, getByPlaceholderText } = render(
      <RegionSelector navigateToDashboard={navigateToDashboard} regions={regions} />,
    )

    fireEvent.changeText(getByPlaceholderText(region.sortingName), 'oldtown')

    regions.forEach(region => expect(queryByText(region.name)).toBeFalsy())
  })

  it('should show all non-live regions if filter text is "wirschaffendas"', () => {
    const { queryByText, getByText, getByPlaceholderText } = render(
      <RegionSelector navigateToDashboard={navigateToDashboard} regions={regions} />,
    )

    fireEvent.changeText(getByPlaceholderText(region.sortingName), 'wirschaffendas')

    regions.filter(region => !region.live).forEach(region => expect(getByText(region.name)).toBeTruthy())
    regions.filter(region => region.live).forEach(region => expect(queryByText(region.name)).toBeFalsy())
  })
})
