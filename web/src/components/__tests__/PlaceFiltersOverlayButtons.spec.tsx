import { fireEvent } from '@testing-library/react'
import React from 'react'

import { PlaceCategoryModel, PlaceModelBuilder } from 'shared/api'

import { renderWithTheme } from '../../testing/render'
import PlaceFiltersOverlayButtons from '../PlaceFiltersOverlayButtons'

jest.mock('react-i18next')

describe('PlaceFiltersOverlayButtons', () => {
  const placeCategory = new PlaceModelBuilder(1).build()[0]!.category
  const setShowFilterSelection = jest.fn()
  const setCurrentlyOpenFilter = jest.fn()
  const setPlaceCategoryFilter = jest.fn()

  const renderPlaceFiltersOverlayButtons = (placeCategory: PlaceCategoryModel | undefined, currentlyOpen: boolean) =>
    renderWithTheme(
      <PlaceFiltersOverlayButtons
        currentlyOpenFilter={currentlyOpen}
        placeCategory={placeCategory}
        setShowFilterSelection={setShowFilterSelection}
        setCurrentlyOpenFilter={setCurrentlyOpenFilter}
        setPlaceCategoryFilter={setPlaceCategoryFilter}
      />,
    )

  it('should show buttons', () => {
    const { getByText } = renderPlaceFiltersOverlayButtons(placeCategory, true)

    fireEvent.click(getByText('places:adjustFilters'))
    expect(setShowFilterSelection).toHaveBeenCalledTimes(1)
    expect(setShowFilterSelection).toHaveBeenCalledWith(true)

    fireEvent.click(getByText('places:opened'))
    expect(setCurrentlyOpenFilter).toHaveBeenCalledTimes(1)
    expect(setCurrentlyOpenFilter).toHaveBeenCalledWith(false)

    fireEvent.click(getByText(placeCategory.name))
    expect(setPlaceCategoryFilter).toHaveBeenCalledTimes(1)
    expect(setPlaceCategoryFilter).toHaveBeenCalledWith(null)
  })

  it('should only show open place filter button', () => {
    const { getByText, queryByText } = renderPlaceFiltersOverlayButtons(undefined, false)

    expect(getByText('places:adjustFilters')).toBeTruthy()
    expect(queryByText('places:opened')).toBeFalsy()
    expect(queryByText(placeCategory.name)).toBeFalsy()
  })
})
