import { fireEvent, render } from '@testing-library/react'
import React from 'react'
import { ThemeProvider } from 'styled-components'

import { PoiModelBuilder, prepareFeatureLocation } from 'api-client'

import buildConfig from '../../constants/buildConfig'
import PoiListItem from '../PoiListItem'

jest.mock('react-i18next')

describe('PoiListItem', () => {
  const selectFeature = jest.fn()
  const poi = new PoiModelBuilder(1).build()[0]!
  const feature = prepareFeatureLocation(poi, [10.994217, 48.415402])!

  it('should render list item information', () => {
    const { getByText } = render(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <PoiListItem selectFeature={selectFeature} poi={feature} />
      </ThemeProvider>
    )

    expect(getByText(feature.properties.title)).toBeTruthy()
    expect(getByText('pois:distanceKilometre')).toBeTruthy()
  })

  it('should select feature', () => {
    const { getByRole } = render(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <PoiListItem selectFeature={selectFeature} poi={feature} />
      </ThemeProvider>
    )

    fireEvent.click(getByRole('button'))
    expect(selectFeature).toHaveBeenCalledTimes(1)
    expect(selectFeature).toHaveBeenCalledWith(feature)
  })
})
