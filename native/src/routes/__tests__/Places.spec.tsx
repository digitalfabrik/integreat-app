import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import { RegionModelBuilder, PlaceModelBuilder } from 'shared/api'

import { UseLocalHistoryReturn } from '../../hooks/useLocalStackHistory'
import TestingAppContext from '../../testing/TestingAppContext'
import renderWithTheme from '../../testing/render'
import Places, { PlaceHistory } from '../Places'

jest.mock('../../components/MapView')
jest.mock('../../components/Page')
jest.mock('react-i18next')
jest.mock('styled-components')
jest.mock('@react-native-community/geolocation')
jest.mock('@gorhom/bottom-sheet', () => ({
  __esModule: true,
  ...require('@gorhom/bottom-sheet/mock'),
}))

const resetHistory: PlaceHistory = {
  slug: undefined,
  multiPlace: undefined,
  placeCategoryId: undefined,
  currentlyOpen: false,
  showFilterSelection: false,
}

const places = new PlaceModelBuilder(3).build()
const place0 = places[0]!
const place1 = places[1]!
const place2 = places[2]!
const region = new RegionModelBuilder(1).build()[0]!

const createLocalHistory = (current: PlaceHistory = resetHistory): UseLocalHistoryReturn<PlaceHistory> => ({
  current,
  history: [current],
  push: jest.fn(),
  pushReset: jest.fn(),
  pop: jest.fn(),
  reset: jest.fn(),
})

describe('Places', () => {
  const renderPlaces = (current: PlaceHistory = resetHistory) => {
    const localHistory = createLocalHistory(current)
    const renderResult = renderWithTheme(
      <TestingAppContext>
        <Places
          refresh={() => undefined}
          localHistory={localHistory}
          places={places}
          regionModel={region}
          initialZoom={undefined}
        />
      </TestingAppContext>,
    )
    return { localHistory, ...renderResult }
  }

  it('should show place list when no selection', () => {
    const { getByText } = renderPlaces()

    expect(getByText(place0.title)).toBeTruthy()
    expect(getByText(place1.title)).toBeTruthy()
    expect(getByText(place2.title)).toBeTruthy()
  })

  it('should show pageNotFound for invalid slug and hide place list', () => {
    const { getByText, queryByText } = renderPlaces({ ...resetHistory, slug: 'invalid' })

    expect(getByText('pageNotFound')).toBeTruthy()
    expect(queryByText(place0.title)).toBeFalsy()
    expect(queryByText(place1.title)).toBeFalsy()
    expect(queryByText(place2.title)).toBeFalsy()
  })

  it('should show place detail when slug matches a place', () => {
    const { getByText, queryByText } = renderPlaces({ ...resetHistory, slug: place1.slug })

    expect(getByText(place1.title)).toBeTruthy()
    expect(getByText(place1.content)).toBeTruthy()
    expect(queryByText(place0.title)).toBeFalsy()
    expect(queryByText(place2.title)).toBeFalsy()
  })

  it('should show filtered place list when multiPlace is set', () => {
    const { getByText, queryByText } = renderPlaces({ ...resetHistory, multiPlace: 0 })

    expect(getByText(place0.title)).toBeTruthy()
    expect(getByText(place2.title)).toBeTruthy()
    expect(queryByText(place1.title)).toBeFalsy()
  })

  it('should show filtered place list when placeCategoryId is set', () => {
    const { getAllByText, getByText, queryByText } = renderPlaces({ ...resetHistory, placeCategoryId: 10 })

    expect(getAllByText('Gastronomie')).toHaveLength(3)
    expect(getByText(place0.title)).toBeTruthy()
    expect(getByText(place2.title)).toBeTruthy()
    expect(queryByText(place1.title)).toBeFalsy()
  })

  it('should call push with place slug when place is selected from list', () => {
    const { localHistory, getByText } = renderPlaces()

    fireEvent.press(getByText(place1.title))

    expect(localHistory.push).toHaveBeenCalledWith({ slug: place1.slug })
  })

  it('should call push with multiPlace id when multiPlace feature is pressed on map', () => {
    const { localHistory, getByText } = renderPlaces()

    fireEvent.press(getByText('Feature-0'))

    expect(localHistory.push).toHaveBeenCalledWith({ multiPlace: 0, slug: undefined })
  })

  it('should call push with slug when single-place map feature is pressed', () => {
    const { localHistory, getByText } = renderPlaces()

    fireEvent.press(getByText(`Feature-${place1.title}`))

    expect(localHistory.push).toHaveBeenCalledWith({ multiPlace: undefined, slug: place1.slug })
  })

  it('should call push to clear slug and multiPlace when Map Press is pressed with place selected', () => {
    const { localHistory, getByText } = renderPlaces({ ...resetHistory, slug: place1.slug })

    fireEvent.press(getByText('Map Press'))

    expect(localHistory.push).toHaveBeenCalledWith({ multiPlace: undefined, slug: undefined })
  })

  it('should not call push when Map Press is pressed with only a multiPlace selected', () => {
    const { localHistory, getByText } = renderPlaces({ ...resetHistory, multiPlace: 0 })

    fireEvent.press(getByText('Map Press'))

    expect(localHistory.push).not.toHaveBeenCalled()
  })

  it('should call push when backToOverview is pressed for an invalid slug', () => {
    const { localHistory, getByText } = renderPlaces({ ...resetHistory, slug: 'invalid' })

    fireEvent.press(getByText('backToOverview'))

    expect(localHistory.push).toHaveBeenCalledWith({})
  })

  it('should call push with multiPlace when backToOverview is pressed with both multiPlace and invalid slug', () => {
    const { localHistory, getByText } = renderPlaces({ ...resetHistory, multiPlace: 0, slug: 'invalid' })

    fireEvent.press(getByText('backToOverview'))

    expect(localHistory.push).toHaveBeenCalledWith({ multiPlace: 0 })
  })

  it('should call push with showFilterSelection when adjustFilters is pressed', () => {
    const { localHistory, getByText } = renderPlaces()

    fireEvent.press(getByText('adjustFilters'))

    expect(localHistory.push).toHaveBeenCalledWith({ showFilterSelection: true })
  })

  it('should not push to history when a category is selected inside the filter modal', () => {
    const { localHistory, getByRole } = renderPlaces({ ...resetHistory, showFilterSelection: true })

    fireEvent.press(getByRole('switch', { name: 'Dienstleistung' }))

    expect(localHistory.push).not.toHaveBeenCalled()
    expect(localHistory.pushReset).not.toHaveBeenCalled()
  })

  it('should pop the filter modal entry before pushReset when showPlaces is pressed', () => {
    const { localHistory, getByText } = renderPlaces({ ...resetHistory, showFilterSelection: true })

    fireEvent.press(getByText('showPlaces'))

    expect(localHistory.pop).toHaveBeenCalledTimes(1)
    expect(localHistory.pushReset).toHaveBeenCalledTimes(1)
    expect(localHistory.pushReset).toHaveBeenCalledWith({
      placeCategoryId: undefined,
      currentlyOpen: false,
    })
    const popOrder = (localHistory.pop as jest.Mock).mock.invocationCallOrder[0]!
    const pushResetOrder = (localHistory.pushReset as jest.Mock).mock.invocationCallOrder[0]!
    expect(popOrder).toBeLessThan(pushResetOrder)
  })

  it('should apply the newly selected category when showPlaces is pressed', () => {
    const { localHistory, getByRole, getByText } = renderPlaces({ ...resetHistory, showFilterSelection: true })

    fireEvent.press(getByRole('switch', { name: 'Dienstleistung' }))
    fireEvent.press(getByText('showPlaces'))

    expect(localHistory.pop).toHaveBeenCalledTimes(1)
    expect(localHistory.pushReset).toHaveBeenCalledTimes(1)
    expect(localHistory.pushReset).toHaveBeenCalledWith({
      placeCategoryId: place1.category.id,
      currentlyOpen: false,
    })
  })

  it('should call pushReset to clear category when category chip is pressed', () => {
    const { localHistory, getAllByText } = renderPlaces({ ...resetHistory, placeCategoryId: 10 })

    fireEvent.press(getAllByText('Gastronomie')[0]!)

    expect(localHistory.pushReset).toHaveBeenCalledWith({
      placeCategoryId: undefined,
      currentlyOpen: false,
    })
  })

  it('should call pushReset to clear currentlyOpen when currentlyOpen chip is pressed', () => {
    const { localHistory, getByText } = renderPlaces({ ...resetHistory, currentlyOpen: true })

    fireEvent.press(getByText('opened'))

    expect(localHistory.pushReset).toHaveBeenCalledWith({
      placeCategoryId: undefined,
      currentlyOpen: false,
    })
  })

  it('should open the filter modal with the current filter values after clearing via the chip', () => {
    const renderAt = (current: PlaceHistory) => {
      const localHistory = createLocalHistory(current)
      return {
        localHistory,
        element: (
          <TestingAppContext>
            <Places
              refresh={() => undefined}
              localHistory={localHistory}
              places={places}
              regionModel={region}
              initialZoom={undefined}
            />
          </TestingAppContext>
        ),
      }
    }

    const initial = renderAt({ ...resetHistory, showFilterSelection: true })
    const { getByRole, getByText, getAllByText, rerender } = renderWithTheme(initial.element)

    fireEvent.press(getByRole('switch', { name: 'Gastronomie' }))
    fireEvent.press(getByText('showPlaces'))
    expect(initial.localHistory.pushReset).toHaveBeenLastCalledWith({
      placeCategoryId: place0.category.id,
      currentlyOpen: false,
    })

    const filtered = renderAt({ ...resetHistory, placeCategoryId: place0.category.id })
    rerender(filtered.element)

    fireEvent.press(getAllByText('Gastronomie')[0]!)
    expect(filtered.localHistory.pushReset).toHaveBeenLastCalledWith({
      placeCategoryId: undefined,
      currentlyOpen: false,
    })

    const reopened = renderAt({ ...resetHistory, showFilterSelection: true })
    rerender(reopened.element)

    fireEvent.press(getByText('showPlaces'))
    expect(reopened.localHistory.pushReset).toHaveBeenLastCalledWith({
      placeCategoryId: undefined,
      currentlyOpen: false,
    })
  })
})
