import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import { PlaceCategoryModel, PlaceModelBuilder } from 'shared/api'

import render from '../../testing/render'
import PlaceFiltersModal from '../PlaceFiltersModal'

jest.mock('styled-components')
jest.mock('react-i18next')
jest.mock('react-native-svg')

describe('PlaceFiltersModal', () => {
  beforeEach(jest.clearAllMocks)

  const placeCategories = new PlaceModelBuilder(2).build().map(it => it.category)

  const closeModal = jest.fn()
  const setSelectedPlaceCategory = jest.fn()
  const setCurrentlyOpenFilter = jest.fn()

  const renderPlaceFiltersModal = ({
    category = undefined,
    currentlyOpen = false,
    placesCount = 0,
  }: {
    category?: PlaceCategoryModel | undefined
    currentlyOpen?: boolean
    placesCount?: number
  }) =>
    render(
      <PlaceFiltersModal
        modalVisible
        closeModal={closeModal}
        placeCategories={placeCategories}
        selectedPlaceCategory={category}
        setSelectedPlaceCategory={setSelectedPlaceCategory}
        currentlyOpenFilter={currentlyOpen}
        setCurrentlyOpenFilter={setCurrentlyOpenFilter}
        placesCount={placesCount}
      />,
    )

  it('should set place category on press', () => {
    const { getByText } = renderPlaceFiltersModal({})

    fireEvent.press(getByText(placeCategories[0]!.name))
    expect(setSelectedPlaceCategory).toHaveBeenCalledTimes(1)
    expect(setSelectedPlaceCategory).toHaveBeenCalledWith(placeCategories[0]!)
  })

  it('should deselect place category on selected place category press', () => {
    const { getByText } = renderPlaceFiltersModal({ category: placeCategories[0]! })

    fireEvent.press(getByText(placeCategories[0]!.name))
    expect(setSelectedPlaceCategory).toHaveBeenCalledTimes(1)
    expect(setSelectedPlaceCategory).toHaveBeenCalledWith(null)
  })

  it('should close modal on button press', () => {
    const { getByText } = renderPlaceFiltersModal({ placesCount: 1 })

    fireEvent.press(getByText('showPlaces'))
    expect(closeModal).toHaveBeenCalledTimes(1)
  })

  it('should not close modal on button press', () => {
    const { getByText } = renderPlaceFiltersModal({ placesCount: 0 })

    fireEvent.press(getByText('showPlaces'))
    expect(closeModal).not.toHaveBeenCalledTimes(1)
  })
})
