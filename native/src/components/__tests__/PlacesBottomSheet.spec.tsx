import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import { PlaceModelBuilder } from 'shared/api'

import TestingAppContext from '../../testing/TestingAppContext'
import renderWithTheme from '../../testing/render'
import PlacesBottomSheet from '../PlacesBottomSheet'

jest.mock('../../components/Page')
jest.mock('react-i18next')
jest.mock('styled-components')
jest.mock('@gorhom/bottom-sheet', () => ({
  __esModule: true,
  ...require('@gorhom/bottom-sheet/mock'),
}))

describe('PlacesBottomSheet', () => {
  const places = new PlaceModelBuilder(3).build()
  const place0 = places[0]!
  const place1 = places[1]!
  const place2 = places[2]!
  const deselectAll = jest.fn()
  const selectPlace = jest.fn()

  const renderPlaces = ({ slug = undefined }: { slug?: string; multipoi?: number; placeCategoryId?: number }) =>
    renderWithTheme(
      <TestingAppContext>
        <PlacesBottomSheet
          refresh={() => undefined}
          slug={slug}
          place={places.find(it => it.slug === slug)}
          places={places}
          snapPoints={[]}
          snapPointIndex={0}
          userLocation={null}
          setSnapPointIndex={jest.fn()}
          deselectAll={deselectAll}
          selectPlace={selectPlace}
          isFullscreen={false}
        />
      </TestingAppContext>,
    )

  it('should show failure if place is not found', () => {
    const { queryByText, getByText } = renderPlaces({ slug: 'invalid' })

    expect(getByText('pageNotFound')).toBeTruthy()
    expect(queryByText(place0.title)).toBeFalsy()
    expect(queryByText(place1.title)).toBeFalsy()
    expect(queryByText(place2.title)).toBeFalsy()

    fireEvent.press(getByText('backToOverview'))

    expect(deselectAll).toHaveBeenCalledTimes(1)
  })

  it('should show list', () => {
    const { getByText } = renderPlaces({})

    expect(getByText(place0.title)).toBeTruthy()
    expect(getByText(place1.title)).toBeTruthy()
    expect(getByText(place2.title)).toBeTruthy()

    fireEvent.press(getByText(place1.title))
    expect(selectPlace).toHaveBeenCalledTimes(1)
    expect(selectPlace).toHaveBeenCalledWith(place1)
  })

  it('should show place', () => {
    const { getByText, queryByText } = renderPlaces({ slug: place2.slug })

    expect(getByText(place2.title)).toBeTruthy()
    expect(getByText(place2.category.name)).toBeTruthy()
    expect(getByText(place2.content)).toBeTruthy()
    expect(getByText(place2.category.name)).toBeTruthy()
    expect(queryByText(place0.title)).toBeFalsy()
    expect(queryByText(place1.title)).toBeFalsy()
  })
})
