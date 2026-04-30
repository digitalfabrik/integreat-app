import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import { CityModelBuilder, PoiModelBuilder } from 'shared/api'

import { UseLocalHistoryReturn } from '../../hooks/useLocalStackHistory'
import TestingAppContext from '../../testing/TestingAppContext'
import renderWithTheme from '../../testing/render'
import Pois from '../Pois'
import { PoiHistory } from '../PoisContainer'

jest.mock('../../components/MapView')
jest.mock('../../components/Page')
jest.mock('react-i18next')
jest.mock('styled-components')
jest.mock('@gorhom/bottom-sheet', () => ({
  __esModule: true,
  ...require('@gorhom/bottom-sheet/mock'),
}))

const resetHistory: PoiHistory = {
  slug: undefined,
  multipoi: undefined,
  poiCategoryId: undefined,
  currentlyOpen: false,
  showFilterSelection: false,
}

const pois = new PoiModelBuilder(3).build()
const poi0 = pois[0]!
const poi1 = pois[1]!
const poi2 = pois[2]!
const city = new CityModelBuilder(1).build()[0]!

const createLocalHistory = (current: PoiHistory = resetHistory): UseLocalHistoryReturn<PoiHistory> => ({
  current,
  history: [current],
  push: jest.fn(),
  pushReset: jest.fn(),
  pop: jest.fn(),
  reset: jest.fn(),
})

describe('Pois', () => {
  const renderPois = (current: PoiHistory = resetHistory) => {
    const localHistory = createLocalHistory(current)
    const renderResult = renderWithTheme(
      <TestingAppContext>
        <Pois localHistory={localHistory} pois={pois} cityModel={city} initialZoom={undefined} />
      </TestingAppContext>,
    )
    return { localHistory, ...renderResult }
  }

  it('should show poi list when no selection', () => {
    const { getByText } = renderPois()

    expect(getByText(poi0.title)).toBeTruthy()
    expect(getByText(poi1.title)).toBeTruthy()
    expect(getByText(poi2.title)).toBeTruthy()
  })

  it('should show pageNotFound for invalid slug and hide poi list', () => {
    const { getByText, queryByText } = renderPois({ ...resetHistory, slug: 'invalid' })

    expect(getByText('pageNotFound')).toBeTruthy()
    expect(queryByText(poi0.title)).toBeFalsy()
    expect(queryByText(poi1.title)).toBeFalsy()
    expect(queryByText(poi2.title)).toBeFalsy()
  })

  it('should show poi detail when slug matches a poi', () => {
    const { getByText, queryByText } = renderPois({ ...resetHistory, slug: poi1.slug })

    expect(getByText(poi1.title)).toBeTruthy()
    expect(getByText(poi1.content)).toBeTruthy()
    expect(queryByText(poi0.title)).toBeFalsy()
    expect(queryByText(poi2.title)).toBeFalsy()
  })

  it('should show filtered poi list when multipoi is set', () => {
    const { getByText, queryByText } = renderPois({ ...resetHistory, multipoi: 0 })

    expect(getByText(poi0.title)).toBeTruthy()
    expect(getByText(poi2.title)).toBeTruthy()
    expect(queryByText(poi1.title)).toBeFalsy()
  })

  it('should show filtered poi list when poiCategoryId is set', () => {
    const { getAllByText, getByText, queryByText } = renderPois({ ...resetHistory, poiCategoryId: 10 })

    expect(getAllByText('Gastronomie')).toHaveLength(3)
    expect(getByText(poi0.title)).toBeTruthy()
    expect(getByText(poi2.title)).toBeTruthy()
    expect(queryByText(poi1.title)).toBeFalsy()
  })

  it('should call push with poi slug when poi is selected from list', () => {
    const { localHistory, getByText } = renderPois()

    fireEvent.press(getByText(poi1.title))

    expect(localHistory.push).toHaveBeenCalledWith({ slug: poi1.slug })
  })

  it('should call push with multipoi id when multipoi feature is pressed on map', () => {
    const { localHistory, getByText } = renderPois()

    fireEvent.press(getByText('Feature-0'))

    expect(localHistory.push).toHaveBeenCalledWith({ multipoi: 0, slug: undefined })
  })

  it('should call push with slug when single-poi map feature is pressed', () => {
    const { localHistory, getByText } = renderPois()

    fireEvent.press(getByText(`Feature-${poi1.title}`))

    expect(localHistory.push).toHaveBeenCalledWith({ multipoi: undefined, slug: poi1.slug })
  })

  it('should call push to clear slug and multipoi when Map Press is pressed with poi selected', () => {
    const { localHistory, getByText } = renderPois({ ...resetHistory, slug: poi1.slug })

    fireEvent.press(getByText('Map Press'))

    expect(localHistory.push).toHaveBeenCalledWith({ multipoi: undefined, slug: undefined })
  })

  it('should not call push when Map Press is pressed with only a multipoi selected', () => {
    const { localHistory, getByText } = renderPois({ ...resetHistory, multipoi: 0 })

    fireEvent.press(getByText('Map Press'))

    expect(localHistory.push).not.toHaveBeenCalled()
  })

  it('should call push when backToOverview is pressed for an invalid slug', () => {
    const { localHistory, getByText } = renderPois({ ...resetHistory, slug: 'invalid' })

    fireEvent.press(getByText('backToOverview'))

    expect(localHistory.push).toHaveBeenCalledWith({})
  })

  it('should call push with multipoi when backToOverview is pressed with both multipoi and invalid slug', () => {
    const { localHistory, getByText } = renderPois({ ...resetHistory, multipoi: 0, slug: 'invalid' })

    fireEvent.press(getByText('backToOverview'))

    expect(localHistory.push).toHaveBeenCalledWith({ multipoi: 0 })
  })

  it('should call push with showFilterSelection when adjustFilters is pressed', () => {
    const { localHistory, getByText } = renderPois()

    fireEvent.press(getByText('adjustFilters'))

    expect(localHistory.push).toHaveBeenCalledWith({ showFilterSelection: true })
  })

  it('should call pop when showPois is pressed in filter modal', () => {
    const { localHistory, getByText } = renderPois({ ...resetHistory, showFilterSelection: true })

    fireEvent.press(getByText('showPois'))

    expect(localHistory.pop).toHaveBeenCalledTimes(1)
  })

  it('should call pushReset with category id when a category is selected in filter modal', () => {
    const { localHistory, getByRole } = renderPois({ ...resetHistory, showFilterSelection: true })

    fireEvent.press(getByRole('switch', { name: 'Dienstleistung' }))

    expect(localHistory.pushReset).toHaveBeenCalledWith({ poiCategoryId: poi1.category.id, currentlyOpen: false })
  })

  it('should call pushReset to clear category when category chip is pressed', () => {
    const { localHistory, getAllByText } = renderPois({ ...resetHistory, poiCategoryId: 10 })

    fireEvent.press(getAllByText('Gastronomie')[0]!)

    expect(localHistory.pushReset).toHaveBeenCalledWith({ poiCategoryId: undefined, currentlyOpen: false })
  })
})
