import { fireEvent } from '@testing-library/react'
import React from 'react'

import { PoiModelBuilder } from 'shared/api'

import { renderWithRouterAndTheme } from '../../testing/render'
import PoiListItem from '../PoiListItem'

jest.mock('react-i18next')

describe('PoiListItem', () => {
  const selectPoi = jest.fn()
  const poi = new PoiModelBuilder(1).build()[0]!

  it('should render list item information', () => {
    const { getByText } = renderWithRouterAndTheme(<PoiListItem selectPoi={selectPoi} poi={poi} distance={3.1} />)

    expect(getByText(poi.title)).toBeTruthy()
    expect(getByText('pois:distanceKilometre')).toBeTruthy()
    expect(getByText(poi.category.name)).toBeTruthy()
  })

  it('should select poi', () => {
    const { getByRole, queryByText } = renderWithRouterAndTheme(
      <PoiListItem selectPoi={selectPoi} poi={poi} distance={null} />,
    )

    expect(queryByText('pois:distanceKilometre')).toBeFalsy()
    fireEvent.click(getByRole('link'))
    expect(selectPoi).toHaveBeenCalledTimes(1)
  })
})
