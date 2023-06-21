import { fireEvent } from '@testing-library/react'
import React from 'react'

import { PoiModelBuilder, prepareFeatureLocation } from 'api-client'

import { renderWithTheme } from '../../testing/render'
import PoiListItem from '../PoiListItem'

jest.mock('react-i18next')

describe('PoiListItem', () => {
  const selectPoi = jest.fn()
  const poi = new PoiModelBuilder(1).build()[0]!
  const feature = prepareFeatureLocation([poi], [10.994217, 48.415402], poi.location.coordinates)!
  const poiFeature = feature.properties.pois[0]!

  it('should render list item information', () => {
    const { getByText } = renderWithTheme(<PoiListItem selectPoi={selectPoi} poi={poiFeature} />)

    expect(getByText(poiFeature.title)).toBeTruthy()
    expect(getByText('pois:distanceKilometre')).toBeTruthy()
    expect(getByText(poiFeature.category!)).toBeTruthy()
  })

  it('should select feature', () => {
    const { getByRole } = renderWithTheme(<PoiListItem selectPoi={selectPoi} poi={poiFeature} />)

    fireEvent.click(getByRole('button'))
    expect(selectPoi).toHaveBeenCalledTimes(1)
    expect(selectPoi).toHaveBeenCalledWith(poiFeature, true)
  })
})
