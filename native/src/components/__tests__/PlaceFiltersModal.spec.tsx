import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import { PlaceCategoryModel, PlaceModelBuilder } from 'shared/api'

import render from '../../testing/render'
import PlaceFiltersModal from '../PlaceFiltersModal'

jest.mock('styled-components')
jest.mock('react-native-svg')

describe('PlaceFiltersModal', () => {
  const placeCategories = new PlaceModelBuilder(2).build().map(it => it.category)
  const firstCategory = placeCategories[0]!
  const secondCategory = placeCategories[1]!

  const closeModal = jest.fn()
  const getPlacesCount = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    getPlacesCount.mockReturnValue(1)
  })

  const renderPlaceFiltersModal = ({
    placeCategoryFilter = undefined,
    currentlyOpenFilter = false,
  }: {
    placeCategoryFilter?: PlaceCategoryModel
    currentlyOpenFilter?: boolean
  } = {}) =>
    render(
      <PlaceFiltersModal
        closeModal={closeModal}
        placeCategories={placeCategories}
        placeCategoryFilter={placeCategoryFilter}
        currentlyOpenFilter={currentlyOpenFilter}
        getPlacesCount={getPlacesCount}
      />,
    )

  it('should not propagate filter changes until the modal is closed', async () => {
    const { getByText } = await renderPlaceFiltersModal()

    await fireEvent.press(getByText(firstCategory.name))
    await fireEvent.press(getByText(secondCategory.name))

    expect(closeModal).not.toHaveBeenCalled()
  })

  it('should close the modal with the selected category', async () => {
    const { getByText } = await renderPlaceFiltersModal()

    await fireEvent.press(getByText(firstCategory.name))
    await fireEvent.press(getByText('places:filter.show 1'))

    expect(closeModal).toHaveBeenCalledTimes(1)
    expect(closeModal).toHaveBeenCalledWith({ placeCategoryFilter: firstCategory, currentlyOpenFilter: false })
  })

  it('should deselect the initially selected category', async () => {
    const { getByText } = await renderPlaceFiltersModal({ placeCategoryFilter: firstCategory })

    await fireEvent.press(getByText(firstCategory.name))
    await fireEvent.press(getByText('places:filter.show 1'))

    expect(closeModal).toHaveBeenCalledWith({ placeCategoryFilter: undefined, currentlyOpenFilter: false })
  })

  it('should switch to a different category when another one is pressed', async () => {
    const { getByText } = await renderPlaceFiltersModal({ placeCategoryFilter: firstCategory })

    await fireEvent.press(getByText(secondCategory.name))
    await fireEvent.press(getByText('places:filter.show 1'))

    expect(closeModal).toHaveBeenCalledWith({ placeCategoryFilter: secondCategory, currentlyOpenFilter: false })
  })

  it('should pass the initial filters back unchanged when nothing is pressed', async () => {
    const { getByText } = await renderPlaceFiltersModal({
      placeCategoryFilter: firstCategory,
      currentlyOpenFilter: true,
    })

    await fireEvent.press(getByText('places:filter.show 1'))

    expect(closeModal).toHaveBeenCalledWith({ placeCategoryFilter: firstCategory, currentlyOpenFilter: true })
  })

  it('should query the places count with the temporary filter selection', async () => {
    const { getByText } = await renderPlaceFiltersModal()

    await fireEvent.press(getByText(firstCategory.name))

    expect(getPlacesCount).toHaveBeenLastCalledWith({ placeCategoryFilter: firstCategory, currentlyOpenFilter: false })
  })

  it('should not close the modal when there are no matching places', async () => {
    getPlacesCount.mockReturnValue(0)
    const { getByText } = await renderPlaceFiltersModal()

    await fireEvent.press(getByText('places:filter.show 0'))

    expect(closeModal).not.toHaveBeenCalled()
  })
})
