import { fireEvent } from '@testing-library/react-native'
import React, { FC, ReactNode } from 'react'
import { Text } from 'react-native'

import { RegionModelBuilder, PlaceModelBuilder } from 'shared/api'

import { UseLocalHistoryReturn } from '../../hooks/useLocalStackHistory'
import TestingAppContext from '../../testing/TestingAppContext'
import renderWithTheme from '../../testing/render'
import Places, { PlaceHistory } from '../Places'

jest.mock('../../components/MapView')
jest.mock('../../components/RemoteContent', () => ({ content }: { content: string }) => <Text>{content}</Text>)
jest.mock('styled-components')
jest.mock('@react-native-community/geolocation')
jest.mock('@gorhom/bottom-sheet', () => {
  const { createElement, Fragment } = jest.requireActual('react')
  return {
    ...jest.requireActual('@gorhom/bottom-sheet/mock'),
    __esModule: true,
    default: ({ handleComponent, children }: { handleComponent?: FC; children?: ReactNode }) =>
      createElement(Fragment, null, handleComponent && createElement(handleComponent), children),
  }
})

const resetHistory: PlaceHistory = {
  slug: undefined,
  multiPlace: undefined,
  placeCategoryId: undefined,
  currentlyOpen: false,
  showFilterSelection: false,
}

const places = new PlaceModelBuilder(4).build()
const place0 = places[0]!
const place1 = places[1]!
const place2 = places[2]!
const place3 = places[3]!
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
  const renderPlaces = async (current: PlaceHistory = resetHistory) => {
    const localHistory = createLocalHistory(current)
    const renderResult = await renderWithTheme(
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

  it('should show nearby title when nothing is selected', async () => {
    const { getByText } = await renderPlaces()

    expect(getByText('userLocation:nearby')).toBeTruthy()
  })

  it('should show place title in handle when a place is selected', async () => {
    const { getByText } = await renderPlaces({ ...resetHistory, slug: place1.slug })

    expect(getByText(place1.title)).toBeTruthy()
  })

  it('should show default title for an invalid slug', async () => {
    const { queryByText } = await renderPlaces({ ...resetHistory, slug: 'invalid' })

    expect(queryByText('userLocation:nearby')).toBeTruthy()
  })

  it('should show place list when no selection', async () => {
    const { getByText } = await renderPlaces()

    expect(getByText(place0.title)).toBeTruthy()
    expect(getByText(place1.title)).toBeTruthy()
    expect(getByText(place2.title)).toBeTruthy()
  })

  it('should show pageNotFound for invalid slug and hide place list', async () => {
    const { getByText, queryByText } = await renderPlaces({ ...resetHistory, slug: 'invalid' })

    expect(getByText('error:pageNotFound')).toBeTruthy()
    expect(queryByText(place0.title)).toBeFalsy()
    expect(queryByText(place1.title)).toBeFalsy()
    expect(queryByText(place2.title)).toBeFalsy()
  })

  it('should show place detail when slug matches a place', async () => {
    const { getByText, queryByText } = await renderPlaces({ ...resetHistory, slug: place1.slug })

    expect(getByText(place1.title)).toBeTruthy()
    expect(getByText(place1.content)).toBeTruthy()
    expect(queryByText(place0.title)).toBeFalsy()
    expect(queryByText(place2.title)).toBeFalsy()
  })

  it('should show filtered place list when multiPlace is set', async () => {
    const { getByText, queryByText } = await renderPlaces({ ...resetHistory, multiPlace: 0 })

    expect(getByText(place0.title)).toBeTruthy()
    expect(getByText(place3.title)).toBeTruthy()
    expect(queryByText(place1.title)).toBeFalsy()
    expect(queryByText(place2.title)).toBeFalsy()
  })

  it('should show filtered place list when placeCategoryId is set', async () => {
    const { getAllByText, getByText, queryByText } = await renderPlaces({ ...resetHistory, placeCategoryId: 10 })

    expect(getAllByText('Gastronomie')).toHaveLength(4)
    expect(getByText(place0.title)).toBeTruthy()
    expect(getByText(place2.title)).toBeTruthy()
    expect(getByText(place3.title)).toBeTruthy()
    expect(queryByText(place1.title)).toBeFalsy()
  })

  it('should call push with place slug when place is selected from list', async () => {
    const { localHistory, getByText } = await renderPlaces()

    await fireEvent.press(getByText(place1.title))

    expect(localHistory.push).toHaveBeenCalledWith({ slug: place1.slug })
  })

  it('should call push with multiPlace id when multiPlace feature is pressed on map', async () => {
    const { localHistory, getByText } = await renderPlaces()

    await fireEvent.press(getByText('Feature-0'))

    expect(localHistory.push).toHaveBeenCalledWith({ multiPlace: 0, slug: undefined })
  })

  it('should call push with slug when single-place map feature is pressed', async () => {
    const { localHistory, getByText } = await renderPlaces()

    await fireEvent.press(getByText(`Feature-${place1.title}`))

    expect(localHistory.push).toHaveBeenCalledWith({ multiPlace: undefined, slug: place1.slug })
  })

  it('should call push to clear slug and multiPlace when Map Press is pressed with place selected', async () => {
    const { localHistory, getByText } = await renderPlaces({ ...resetHistory, slug: place1.slug })

    await fireEvent.press(getByText('Map Press'))

    expect(localHistory.push).toHaveBeenCalledWith({ multiPlace: undefined, slug: undefined })
  })

  it('should call push to clear multiPlace when map is pressed with only a multiPlace selected', async () => {
    const { localHistory, getByText } = await renderPlaces({ ...resetHistory, multiPlace: 0 })

    await fireEvent.press(getByText('Map Press'))

    expect(localHistory.push).toHaveBeenCalledWith({ multiPlace: undefined, slug: undefined })
  })

  it('should not call push when Map Press is pressed with nothing selected', async () => {
    const { localHistory, getByText } = await renderPlaces()

    await fireEvent.press(getByText('Map Press'))

    expect(localHistory.push).not.toHaveBeenCalled()
  })

  it('should call push when backToOverview is pressed for an invalid slug', async () => {
    const { localHistory, getByText } = await renderPlaces({ ...resetHistory, slug: 'invalid' })

    await fireEvent.press(getByText('common:actions.back'))

    expect(localHistory.push).toHaveBeenCalledWith({})
  })

  it('should call push with multiPlace when backToOverview is pressed with both multiPlace and invalid slug', async () => {
    const { localHistory, getByText } = await renderPlaces({ ...resetHistory, multiPlace: 0, slug: 'invalid' })

    await fireEvent.press(getByText('common:actions.back'))

    expect(localHistory.push).toHaveBeenCalledWith({ multiPlace: 0 })
  })

  it('should call push with showFilterSelection when adjustFilters is pressed', async () => {
    const { localHistory, getByText } = await renderPlaces()

    await fireEvent.press(getByText('places:filter.adjust'))

    expect(localHistory.push).toHaveBeenCalledWith({ showFilterSelection: true })
  })

  it('should not push to history when a category is selected inside the filter modal', async () => {
    const { localHistory, getByRole } = await renderPlaces({ ...resetHistory, showFilterSelection: true })

    await fireEvent.press(getByRole('button', { name: 'Dienstleistung' }))

    expect(localHistory.push).not.toHaveBeenCalled()
    expect(localHistory.pushReset).not.toHaveBeenCalled()
  })

  it('should pop the filter modal entry before pushReset when showPlaces is pressed', async () => {
    const { localHistory, getByText } = await renderPlaces({ ...resetHistory, showFilterSelection: true })

    await fireEvent.press(getByText('places:filter.show 4'))

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

  it('should apply the newly selected category when showPlaces is pressed', async () => {
    const { localHistory, getByRole, getByText } = await renderPlaces({ ...resetHistory, showFilterSelection: true })

    await fireEvent.press(getByRole('button', { name: 'Dienstleistung' }))
    await fireEvent.press(getByText('places:filter.show 1'))

    expect(localHistory.pop).toHaveBeenCalledTimes(1)
    expect(localHistory.pushReset).toHaveBeenCalledTimes(1)
    expect(localHistory.pushReset).toHaveBeenCalledWith({
      placeCategoryId: place1.category.id,
      currentlyOpen: false,
    })
  })

  it('should call pushReset to clear category when category chip is pressed', async () => {
    const { localHistory, getAllByText } = await renderPlaces({ ...resetHistory, placeCategoryId: 10 })

    await fireEvent.press(getAllByText('Gastronomie')[0]!)

    expect(localHistory.pushReset).toHaveBeenCalledWith({
      placeCategoryId: undefined,
      currentlyOpen: false,
    })
  })

  it('should call pushReset to clear currentlyOpen when currentlyOpen chip is pressed', async () => {
    const { localHistory, getByText } = await renderPlaces({ ...resetHistory, currentlyOpen: true })

    await fireEvent.press(getByText('places:hours.open'))

    expect(localHistory.pushReset).toHaveBeenCalledWith({
      placeCategoryId: undefined,
      currentlyOpen: false,
    })
  })

  it('should open the filter modal with the current filter values after clearing via the chip', async () => {
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
    const { getByRole, getByText, getAllByText, rerender } = await renderWithTheme(initial.element)

    await fireEvent.press(getByRole('button', { name: 'Gastronomie' }))
    await fireEvent.press(getByText('places:filter.show 3'))
    expect(initial.localHistory.pushReset).toHaveBeenLastCalledWith({
      placeCategoryId: place0.category.id,
      currentlyOpen: false,
    })

    const filtered = renderAt({ ...resetHistory, placeCategoryId: place0.category.id })
    await rerender(filtered.element)

    await fireEvent.press(getAllByText('Gastronomie')[0]!)
    expect(filtered.localHistory.pushReset).toHaveBeenLastCalledWith({
      placeCategoryId: undefined,
      currentlyOpen: false,
    })

    const reopened = renderAt({ ...resetHistory, showFilterSelection: true })
    await rerender(reopened.element)

    await fireEvent.press(getByText('places:filter.show 4'))
    expect(reopened.localHistory.pushReset).toHaveBeenLastCalledWith({
      placeCategoryId: undefined,
      currentlyOpen: false,
    })
  })
})
