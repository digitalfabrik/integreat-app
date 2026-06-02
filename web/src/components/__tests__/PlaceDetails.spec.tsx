import React from 'react'

import { PlaceModelBuilder } from 'shared/api'

import { renderWithRouterAndTheme } from '../../testing/render'
import PlaceDetails from '../PlaceDetails'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params?: { distance: string }) => (params ? `${key}: ${params.distance}` : key),
  }),
}))

describe('PlaceDetails', () => {
  const places = new PlaceModelBuilder(3).build()
  const distance = 3

  it('should render the place information', () => {
    const place = places[0]!
    const { getByText } = renderWithRouterAndTheme(<PlaceDetails place={place} distance={distance} />)

    expect(getByText(place.title)).toBeTruthy()
    expect(getByText(place.category.name)).toBeTruthy()
    expect(getByText(`distanceKilometre: 3.0`)).toBeTruthy()
    expect(getByText(place.location.address)).toBeTruthy()
    expect(getByText(`${place.location.postcode} ${place.location.town}`)).toBeTruthy()
    expect(getByText('detailsInformation')).toBeTruthy()
    expect(getByText(place.content)).toBeTruthy()
    const contact = place.contacts[0]!
    expect(getByText(`${contact.name} | ${contact.areaOfResponsibility}`)).toBeTruthy()
    expect(getByText(contact.phoneNumber as string)).toBeTruthy()
    expect(getByText(contact.email as string)).toBeTruthy()
    expect(getByText('contacts')).toBeTruthy()
  })

  it('should not render the distance if it is null', () => {
    const place = places[0]!
    const { queryByText } = renderWithRouterAndTheme(<PlaceDetails place={place} distance={null} />)
    expect(queryByText('distanceKilometre', { exact: false })).toBeFalsy()
  })

  it('should not render contacts section if there are no contacts', () => {
    const place = places[1]!
    const { queryByText } = renderWithRouterAndTheme(<PlaceDetails place={place} distance={distance} />)
    expect(queryByText('contacts')).toBeFalsy()
  })

  it('should render the opening hours', () => {
    const place = places[0]!
    const { getByText } = renderWithRouterAndTheme(<PlaceDetails place={place} distance={distance} />)
    expect(getByText('detailsInformation')).toBeTruthy()
  })

  it('should render the content section', () => {
    const place = places[0]!
    const { getByText } = renderWithRouterAndTheme(<PlaceDetails place={place} distance={distance} />)
    expect(getByText(place.content)).toBeTruthy()
  })

  it('should show accessibility information for an accessible PLACE', () => {
    const accessiblePlace = places[0]!
    const { getByText } = renderWithRouterAndTheme(<PlaceDetails place={accessiblePlace} distance={distance} />)
    expect(getByText('common:accessible')).toBeTruthy()
  })

  it('should show accessibility information for a not accessible PLACE', () => {
    const notAccessiblePlace = places[1]!
    const { getByText } = renderWithRouterAndTheme(<PlaceDetails place={notAccessiblePlace} distance={distance} />)
    expect(getByText('common:notAccessible')).toBeTruthy()
  })

  it('should not show accessibility information for a PLACE with unknown accessibility', () => {
    const unknownAccessiblePlace = places[2]!
    const { queryByText } = renderWithRouterAndTheme(
      <PlaceDetails place={unknownAccessiblePlace} distance={distance} />,
    )
    expect(queryByText('common:accessible')).toBeFalsy()
    expect(queryByText('common:notAccessible')).toBeFalsy()
  })

  it('should show the PLACE organization if there is one', () => {
    const place = places[0]!
    const { getByText } = renderWithRouterAndTheme(<PlaceDetails place={place} distance={distance} />)
    expect(getByText('Tür an Tür')).toBeTruthy()
  })
})
