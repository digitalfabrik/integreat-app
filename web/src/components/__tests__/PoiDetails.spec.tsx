import React from 'react'

import { PoiModelBuilder } from 'shared/api'

import { renderWithRouterAndTheme } from '../../testing/render'
import PoiDetails from '../PoiDetails'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params?: { distance: string }) => (params ? `${key}: ${params.distance}` : key),
  }),
}))

describe('PoiDetails', () => {
  const pois = new PoiModelBuilder(3).build()
  const distance = 3

  it('should render the poi information', () => {
    const poi = pois[0]!
    const { getByText } = renderWithRouterAndTheme(<PoiDetails poi={poi} distance={distance} />)

    expect(getByText(poi.title)).toBeTruthy()
    expect(getByText(poi.category.name)).toBeTruthy()
    expect(getByText(`distanceKilometre: 3.0`)).toBeTruthy()
    expect(getByText(poi.location.address)).toBeTruthy()
    expect(getByText(`${poi.location.postcode} ${poi.location.town}`)).toBeTruthy()
    expect(getByText('detailsInformation')).toBeTruthy()
    expect(getByText(poi.content)).toBeTruthy()
    const contact = poi.contacts[0]!
    expect(getByText(`${contact.name} | ${contact.areaOfResponsibility}`)).toBeTruthy()
    expect(getByText(contact.phoneNumber as string)).toBeTruthy()
    expect(getByText(contact.email as string)).toBeTruthy()
    expect(getByText('contacts')).toBeTruthy()
  })

  it('should not render the distance if it is null', () => {
    const poi = pois[0]!
    const { queryByText } = renderWithRouterAndTheme(<PoiDetails poi={poi} distance={null} />)
    expect(queryByText('distanceKilometre', { exact: false })).toBeFalsy()
  })

  it('should not render contacts section if there are no contacts', () => {
    const poi = pois[1]!
    const { queryByText } = renderWithRouterAndTheme(<PoiDetails poi={poi} distance={distance} />)
    expect(queryByText('contacts')).toBeFalsy()
  })

  it('should render the opening hours', () => {
    const poi = pois[0]!
    const { getByText } = renderWithRouterAndTheme(<PoiDetails poi={poi} distance={distance} />)
    expect(getByText('detailsInformation')).toBeTruthy()
  })

  it('should render the content section', () => {
    const poi = pois[0]!
    const { getByText } = renderWithRouterAndTheme(<PoiDetails poi={poi} distance={distance} />)
    expect(getByText(poi.content)).toBeTruthy()
  })

  it('should show accessibility information for an accessible POI', () => {
    const accessiblePoi = pois[0]!
    const { getByText } = renderWithRouterAndTheme(<PoiDetails poi={accessiblePoi} distance={distance} />)
    expect(getByText('common:accessible')).toBeTruthy()
  })

  it('should show accessibility information for a not accessible POI', () => {
    const notAccessiblePoi = pois[1]!
    const { getByText } = renderWithRouterAndTheme(<PoiDetails poi={notAccessiblePoi} distance={distance} />)
    expect(getByText('common:notAccessible')).toBeTruthy()
  })

  it('should not show accessibility information for a POI with unknown accessibility', () => {
    const unknownAccessiblePoi = pois[2]!
    const { queryByText } = renderWithRouterAndTheme(<PoiDetails poi={unknownAccessiblePoi} distance={distance} />)
    expect(queryByText('common:accessible')).toBeFalsy()
    expect(queryByText('common:notAccessible')).toBeFalsy()
  })

  it('should show the POI organization if there is one', () => {
    const poi = pois[0]!
    const { getByText } = renderWithRouterAndTheme(<PoiDetails poi={poi} distance={distance} />)
    expect(getByText('Tür an Tür')).toBeTruthy()
  })
})
