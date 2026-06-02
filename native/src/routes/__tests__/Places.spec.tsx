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
  multipoi: undefined,
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

  it('should show filtered place list when multipoi is set', () => {
    const { getByText, queryByText } = renderPlaces({ ...resetHistory, multipoi: 0 })

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

  it('should call push with multipoi id when multipoi feature is pressed on map', () => {
    const { localHistory, getByText } = renderPlaces()

    fireEvent.press(getByText('Feature-0'))

    expect(localHistory.push).toHaveBeenCalledWith({ multipoi: 0, slug: undefined })
  })

  it('should call push with slug when single-place map feature is pressed', () => {
    const { localHistory, getByText } = renderPlaces()

    fireEvent.press(getByText(`Feature-${place1.title}`))

    expect(localHistory.push).toHaveBeenCalledWith({ multipoi: undefined, slug: place1.slug })
  })

  it('should call push to clear slug and multipoi when Map Press is pressed with place selected', () => {
    const { localHistory, getByText } = renderPlaces({ ...resetHistory, slug: place1.slug })

    fireEvent.press(getByText('Map Press'))

    expect(localHistory.push).toHaveBeenCalledWith({ multipoi: undefined, slug: undefined })
  })

  it('should not call push when Map Press is pressed with only a multipoi selected', () => {
    const { localHistory, getByText } = renderPlaces({ ...resetHistory, multipoi: 0 })

    fireEvent.press(getByText('Map Press'))

    expect(localHistory.push).not.toHaveBeenCalled()
  })

  it('should call push when backToOverview is pressed for an invalid slug', () => {
    const { localHistory, getByText } = renderPlaces({ ...resetHistory, slug: 'invalid' })

    fireEvent.press(getByText('backToOverview'))

    expect(localHistory.push).toHaveBeenCalledWith({})
  })

  it('should call push with multipoi when backToOverview is pressed with both multipoi and invalid slug', () => {
    const { localHistory, getByText } = renderPlaces({ ...resetHistory, multipoi: 0, slug: 'invalid' })

    fireEvent.press(getByText('backToOverview'))

    expect(localHistory.push).toHaveBeenCalledWith({ multipoi: 0 })
  })

  it('should call push with showFilterSelection when adjustFilters is pressed', () => {
    const { localHistory, getByText } = renderPlaces()

    fireEvent.press(getByText('adjustFilters'))

    expect(localHistory.push).toHaveBeenCalledWith({ showFilterSelection: true })
  })

  it('should call pop when showPlaces is pressed in filter modal', () => {
    const { localHistory, getByText } = renderPlaces({ ...resetHistory, showFilterSelection: true })

    fireEvent.press(getByText('showPlaces'))

    expect(localHistory.pop).toHaveBeenCalledTimes(1)
  })

  it('should call pushReset with category id when a category is selected in filter modal', () => {
    const { localHistory, getByRole } = renderPlaces({ ...resetHistory, showFilterSelection: true })

    fireEvent.press(getByRole('switch', { name: 'Dienstleistung' }))

    expect(localHistory.pushReset).toHaveBeenCalledWith({ placeCategoryId: place1.category.id, currentlyOpen: false })
  })

  it('should call pushReset to clear category when category chip is pressed', () => {
    const { localHistory, getAllByText } = renderPlaces({ ...resetHistory, placeCategoryId: 10 })

    fireEvent.press(getAllByText('Gastronomie')[0]!)

    expect(localHistory.pushReset).toHaveBeenCalledWith({ placeCategoryId: undefined, currentlyOpen: false })
  })
})
