import Clipboard from '@react-native-clipboard/clipboard'
import { fireEvent, waitFor } from '@testing-library/react-native'
import React from 'react'

import { PlaceModelBuilder } from 'shared/api'

import useSnackbar from '../../hooks/useSnackbar'
import renderWithTheme from '../../testing/render'
import PlaceDetails from '../PlaceDetails'

const mockOpenExternalUrl = jest.fn()
jest.mock('../../utils/openExternalUrl', () => ({ __esModule: true, default: () => mockOpenExternalUrl }))
jest.mock('@react-native-clipboard/clipboard', () => ({
  setString: jest.fn(),
}))
jest.mock('../../hooks/useSnackbar')
jest.mock('styled-components')
jest.mock('../Page')

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
    expect(getByText('places:distanceKilometre')).toBeTruthy()
    expect(getByText(place.location.address)).toBeTruthy()
    expect(getByText(`${place.location.postcode} ${place.location.town}`)).toBeTruthy()
    expect(getByText('places:description')).toBeTruthy()
    expect(getByText(place.content)).toBeTruthy()

    fireEvent.press(getByText('places:contacts'))
    const contact = place.contacts[0]!
    expect(getByText(contact.headline!)).toBeTruthy()
    expect(getByText('places:website')).toBeTruthy()
    expect(getByText(contact.phoneNumber!)).toBeTruthy()
    expect(getByText(contact.email!)).toBeTruthy()
  })

  it('should not render distance if there is none', () => {
    const place = places[0]!
    const { queryByText } = renderWithTheme(
      <PlaceDetails place={place} language={language} distance={null} onFocus={jest.fn()} />,
    )

    expect(queryByText('places:distanceKilometre', { exact: false })).toBeFalsy()
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

    expect(queryByText('places:contactInformation')).toBeFalsy()
  })

  it('should open external maps app on icon click', async () => {
    const place = places[0]!
    const { getByLabelText } = renderWithTheme(
      <PlaceDetails onFocus={jest.fn()} place={place} language={language} distance={distance} />,
    )

    fireEvent.press(getByLabelText('places:openExternalMaps'))
    const externalMapsUrl = 'maps:30,30?q=Test Title, Test Address 1, 12345 Test Town'
    await waitFor(() => expect(mockOpenExternalUrl).toHaveBeenCalledWith(externalMapsUrl))
  })

  it('should copy address to clipboard', () => {
    const place = places[0]!
    const { getByText } = renderWithTheme(
      <PlaceDetails onFocus={jest.fn()} place={place} language={language} distance={distance} />,
    )

    fireEvent.press(getByText(place.location.address))
    expect(Clipboard.setString).toHaveBeenCalledWith('Test Address 1, 12345 Test Town')
    expect(showSnackbar).toHaveBeenCalledWith({ text: 'places:addressCopied' })
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
