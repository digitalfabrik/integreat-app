import { fireEvent } from '@testing-library/react'
import React from 'react'

import { PoiCategoryModel, PoiModelBuilder } from 'shared/api'

import { renderWithTheme } from '../../testing/render'
import PoiFiltersOverlayButtons from '../PoiFiltersOverlayButtons'

jest.mock('react-i18next')

describe('PoiFiltersOverlayButtons', () => {
  const poiCategory = new PoiModelBuilder(1).build()[0]!.category
  const setShowFilterSelection = jest.fn()
  const setCurrentlyOpenFilter = jest.fn()
  const setPoiCategoryFilter = jest.fn()

  const renderPoiFiltersOverlayButtons = (poiCategory: PoiCategoryModel | undefined, currentlyOpen: boolean) =>
    renderWithTheme(
      <PoiFiltersOverlayButtons
        currentlyOpenFilter={currentlyOpen}
        poiCategory={poiCategory}
        setShowFilterSelection={setShowFilterSelection}
        setCurrentlyOpenFilter={setCurrentlyOpenFilter}
        setPoiCategoryFilter={setPoiCategoryFilter}
      />,
    )

  it('should show buttons', () => {
    const { getByText } = renderPoiFiltersOverlayButtons(poiCategory, true)

    fireEvent.click(getByText('pois:adjustFilters'))
    expect(setShowFilterSelection).toHaveBeenCalledTimes(1)
    expect(setShowFilterSelection).toHaveBeenCalledWith(true)

    fireEvent.click(getByText('pois:opened'))
    expect(setCurrentlyOpenFilter).toHaveBeenCalledTimes(1)
    expect(setCurrentlyOpenFilter).toHaveBeenCalledWith(false)

    fireEvent.click(getByText(poiCategory.name))
    expect(setPoiCategoryFilter).toHaveBeenCalledTimes(1)
    expect(setPoiCategoryFilter).toHaveBeenCalledWith(null)
  })

  it('should only show open poi filter button', () => {
    const { getByText, queryByText } = renderPoiFiltersOverlayButtons(undefined, false)

    expect(getByText('pois:adjustFilters')).toBeTruthy()
    expect(queryByText('pois:opened')).toBeFalsy()
    expect(queryByText(poiCategory.name)).toBeFalsy()
  })
})
