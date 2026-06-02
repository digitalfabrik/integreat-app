import { fireEvent } from '@testing-library/react'
import React from 'react'

import { PlaceModelBuilder } from 'shared/api'

import { renderWithRouterAndTheme } from '../../testing/render'
import PlaceListItem from '../PlaceListItem'

jest.mock('react-i18next')

describe('PlaceListItem', () => {
  const onClick = jest.fn()
  const place = new PlaceModelBuilder(1).build()[0]!

  it('should render list item information', () => {
    const { getByText } = renderWithRouterAndTheme(<PlaceListItem onClick={onClick} place={place} distance={3.1} />)

    expect(getByText(place.title)).toBeTruthy()
    expect(getByText('places:distanceKilometre')).toBeTruthy()
    expect(getByText(place.category.name)).toBeTruthy()
  })

  it('should call onClick when clicked', () => {
    const { getByRole, queryByText } = renderWithRouterAndTheme(
      <PlaceListItem onClick={onClick} place={place} distance={null} />,
    )

    expect(queryByText('places:distanceKilometre')).toBeFalsy()
    fireEvent.click(getByRole('link'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
