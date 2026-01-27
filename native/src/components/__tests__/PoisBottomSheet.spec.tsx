import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import { PoiModelBuilder } from 'shared/api'

import TestingAppContext from '../../testing/TestingAppContext'
import renderWithTheme from '../../testing/render'
import PoisBottomSheet from '../PoisBottomSheet'

jest.mock('../../components/Page')
jest.mock('react-i18next')
jest.mock('styled-components')
jest.mock('@gorhom/bottom-sheet', () => ({
  __esModule: true,
  ...require('@gorhom/bottom-sheet/mock'),
}))

describe('PoisBottomSheet', () => {
  const pois = new PoiModelBuilder(3).build()
  const poi0 = pois[0]!
  const poi1 = pois[1]!
  const poi2 = pois[2]!
  const deselectAll = jest.fn()
  const selectPoi = jest.fn()

  const renderPois = ({ slug = undefined }: { slug?: string; multipoi?: number; poiCategoryId?: number }) =>
    renderWithTheme(
      <TestingAppContext>
        <PoisBottomSheet
          slug={slug}
          poi={pois.find(it => it.slug === slug)}
          pois={pois}
          snapPoints={[]}
          snapPointIndex={0}
          userLocation={null}
          poiListRef={jest.fn()}
          setScrollPosition={jest.fn()}
          setSnapPointIndex={jest.fn()}
          deselectAll={deselectAll}
          selectPoi={selectPoi}
          isFullscreen={false}
        />
      </TestingAppContext>,
    )

  it('should show failure if poi is not found', () => {
    const { queryByText, getByText } = renderPois({ slug: 'invalid' })

    expect(getByText('pageNotFound')).toBeTruthy()
    expect(queryByText(poi0.title)).toBeFalsy()
    expect(queryByText(poi1.title)).toBeFalsy()
    expect(queryByText(poi2.title)).toBeFalsy()

    fireEvent.press(getByText('backToOverview'))

    expect(deselectAll).toHaveBeenCalledTimes(1)
  })

  it('should show list', () => {
    const { getByText } = renderPois({})

    expect(getByText(poi0.title)).toBeTruthy()
    expect(getByText(poi1.title)).toBeTruthy()
    expect(getByText(poi2.title)).toBeTruthy()

    fireEvent.press(getByText(poi1.title))
    expect(selectPoi).toHaveBeenCalledTimes(1)
    expect(selectPoi).toHaveBeenCalledWith(poi1)
  })

  it('should show poi', () => {
    const { getByText, queryByText } = renderPois({ slug: poi2.slug })

    expect(getByText(poi2.title)).toBeTruthy()
    expect(getByText(poi2.category.name)).toBeTruthy()
    expect(getByText(poi2.content)).toBeTruthy()
    expect(getByText(poi2.category.name)).toBeTruthy()
    expect(queryByText(poi0.title)).toBeFalsy()
    expect(queryByText(poi1.title)).toBeFalsy()
  })
})
