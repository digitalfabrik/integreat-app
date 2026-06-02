import Clipboard from '@react-native-clipboard/clipboard'
import { fireEvent, waitFor } from '@testing-library/react-native'
import React from 'react'

import { PlaceModelBuilder } from 'shared/api'

import useSnackbar from '../../hooks/useSnackbar'
import renderWithTheme from '../../testing/render'
import openExternalUrl from '../../utils/openExternalUrl'
import PlaceDetails from '../PlaceDetails'

jest.mock('../../utils/openExternalUrl', () => jest.fn(async () => undefined))
jest.mock('@react-native-clipboard/clipboard', () => ({
  setString: jest.fn(),
}))
jest.mock('../../hooks/useSnackbar')
jest.mock('styled-components')
jest.mock('../Page')
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params: { distance: string } | undefined) => (params ? `${key}: ${params.distance}` : key),
  }),
}))

describe('PlaceDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const showSnackbar = jest.fn()
  const { mocked } = jest
  mocked(useSnackbar).mockImplementation(() => showSnackbar)

  const places = new PlaceModelBuilder(3).build()
  const language = 'de'
  const distance = 3.1

  it('should render place information', () => {
    const place = places[0]!
    const { getByText } = renderWithTheme(
      <PlaceDetails place={place} language={language} distance={distance} onFocus={jest.fn()} />,
    )

    expect(getByText(place.title)).toBeTruthy()
    expect(getByText(place.category!.name!)).toBeTruthy()
    expect(getByText(`distanceKilometre: ${distance}`)).toBeTruthy()
    expect(getByText(place.location.address)).toBeTruthy()
    expect(getByText(`${place.location.postcode} ${place.location.town}`)).toBeTruthy()
    expect(getByText('description')).toBeTruthy()
    expect(getByText(place.content)).toBeTruthy()

    fireEvent.press(getByText('contacts'))
    const contact = place.contacts[0]!
    expect(getByText(contact.headline!)).toBeTruthy()
    expect(getByText('website')).toBeTruthy()
    expect(getByText(contact.phoneNumber!)).toBeTruthy()
    expect(getByText(contact.email!)).toBeTruthy()
  })

  it('should not render distance if there is none', () => {
    const place = places[0]!
    const { queryByText } = renderWithTheme(
      <PlaceDetails place={place} language={language} distance={null} onFocus={jest.fn()} />,
    )

    expect(queryByText('distanceKilometre', { exact: false })).toBeFalsy()
  })

  it('should not render contact information if there is none', () => {
    const placeWithoutContactInformation = places[1]!

    const { queryByText } = renderWithTheme(
      <PlaceDetails
        onFocus={jest.fn()}
        place={placeWithoutContactInformation}
        language={language}
        distance={distance}
      />,
    )

    expect(queryByText('contactInformation')).toBeFalsy()
  })

  it('should open external maps app on icon click', async () => {
    const place = places[0]!
    const { getByLabelText } = renderWithTheme(
      <PlaceDetails onFocus={jest.fn()} place={place} language={language} distance={distance} />,
    )

    fireEvent.press(getByLabelText('openExternalMaps'))
    const externalMapsUrl = 'maps:30,30?q=Test Title, Test Address 1, 12345 Test Town'
    await waitFor(() => expect(openExternalUrl).toHaveBeenCalledWith(externalMapsUrl, expect.any(Function)))
  })

  it('should copy address to clipboard', () => {
    const place = places[0]!
    const { getByText } = renderWithTheme(
      <PlaceDetails onFocus={jest.fn()} place={place} language={language} distance={distance} />,
    )

    fireEvent.press(getByText(place.location.address))
    expect(Clipboard.setString).toHaveBeenCalledWith('Test Address 1, 12345 Test Town')
    expect(showSnackbar).toHaveBeenCalledWith({ text: 'addressCopied' })
  })

  it('should show accessibility information for accessible PLACE', () => {
    const accessiblePlace = places[0]!
    const { getByText } = renderWithTheme(
      <PlaceDetails onFocus={jest.fn()} place={accessiblePlace} language={language} distance={distance} />,
    )
    expect(getByText('common:accessible')).toBeTruthy()
  })

  it('should show accessibility information for not accessible PLACE', () => {
    const notAccessiblePlace = places[1]!
    const { getByText } = renderWithTheme(
      <PlaceDetails onFocus={jest.fn()} place={notAccessiblePlace} language={language} distance={distance} />,
    )
    expect(getByText('common:notAccessible')).toBeTruthy()
  })

  it('should not show accessibility information for PLACE with unknown accessibility', () => {
    const unknownAccessiblePlace = places[2]!
    const { queryByText } = renderWithTheme(
      <PlaceDetails onFocus={jest.fn()} place={unknownAccessiblePlace} language={language} distance={distance} />,
    )
    expect(queryByText('common:accessible')).toBeFalsy()
    expect(queryByText('common:notAccessible')).toBeFalsy()
  })

  it('should show the PLACE organization if there is one', () => {
    const place = places[0]!
    const { getByText } = renderWithTheme(
      <PlaceDetails onFocus={jest.fn()} place={place} language={language} distance={distance} />,
    )
    expect(getByText('Tür an Tür')).toBeTruthy()
  })
})
