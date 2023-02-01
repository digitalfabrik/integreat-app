import { fireEvent } from '@testing-library/react'
import React from 'react'

import { PoiModelBuilder, prepareFeatureLocation } from 'api-client'

import { renderWithTheme } from '../../testing/render'
import PoiListItem from '../PoiListItem'

jest.mock('react-i18next')

describe('PoiListItem', () => {
  const selectFeature = jest.fn()
  const poi = new PoiModelBuilder(1).build()[0]!
  const feature = prepareFeatureLocation(poi, [10.994217, 48.415402], [])!

  it('should render list item information', () => {
    const { getByText } = renderWithTheme(<PoiListItem selectFeature={selectFeature} poi={feature} />)

    expect(getByText(feature.properties.title)).toBeTruthy()
    expect(getByText('pois:distanceKilometre')).toBeTruthy()
    expect(getByText(feature.properties.category!)).toBeTruthy()
  })

  it('should select feature', () => {
    const { getByRole } = renderWithTheme(<PoiListItem selectFeature={selectFeature} poi={feature} />)

    fireEvent.click(getByRole('button'))
    expect(selectFeature).toHaveBeenCalledTimes(1)
    expect(selectFeature).toHaveBeenCalledWith(feature)
  })
})
