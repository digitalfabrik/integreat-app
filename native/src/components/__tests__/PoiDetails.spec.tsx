import Clipboard from '@react-native-clipboard/clipboard'
import { fireEvent, waitFor } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'

import { PoiModelBuilder } from 'shared/api'

import useSnackbar from '../../hooks/useSnackbar'
import renderWithTheme from '../../testing/render'
import openExternalUrl from '../../utils/openExternalUrl'
import PoiDetails from '../PoiDetails'

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

describe('PoiDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const showSnackbar = jest.fn()
  mocked(useSnackbar).mockImplementation(() => showSnackbar)

  const pois = new PoiModelBuilder(2).build()
  const language = 'de'
  const distance = 3.1

  it('should render poi information', () => {
    const poi = pois[0]!
    const { getByText } = renderWithTheme(<PoiDetails poi={poi} language={language} distance={distance} />)

    expect(getByText(poi.title)).toBeTruthy()
    expect(getByText(poi.category!.name!)).toBeTruthy()
    expect(getByText(`distanceKilometre: ${distance}`)).toBeTruthy()
    expect(getByText(poi.location.address)).toBeTruthy()
    expect(getByText(`${poi.location.postcode} ${poi.location.town}`)).toBeTruthy()
    expect(getByText('description')).toBeTruthy()
    expect(getByText(poi.content)).toBeTruthy()

    expect(getByText('contactInformation')).toBeTruthy()
    expect(getByText(poi.website!)).toBeTruthy()
    expect(getByText(poi.phoneNumber!)).toBeTruthy()
    expect(getByText(poi.email!)).toBeTruthy()
  })

  it('should not render distance if there is none', () => {
    const poi = pois[0]!
    const { queryByText } = renderWithTheme(<PoiDetails poi={poi} language={language} distance={null} />)

    expect(queryByText('distanceKilometre', { exact: false })).toBeFalsy()
  })

  it('should not render contact information if there is none', () => {
    const poiWithoutContactInformation = pois[1]!

    const { queryByText } = renderWithTheme(
      <PoiDetails poi={poiWithoutContactInformation} language={language} distance={distance} />,
    )

    expect(queryByText('contactInformation')).toBeFalsy()
  })

  it('should open external maps app on icon click', async () => {
    const poi = pois[0]!
    const { getByLabelText } = renderWithTheme(<PoiDetails poi={poi} language={language} distance={distance} />)

    fireEvent.press(getByLabelText('openExternalMaps'))
    const externalMapsUrl = 'maps:30,30?q=Test Title, Test Address 1, 12345 Test Town'
    await waitFor(() => expect(openExternalUrl).toHaveBeenCalledWith(externalMapsUrl, expect.any(Function)))
  })

  it('should copy address to clipboard', () => {
    const poi = pois[0]!
    const { getByText } = renderWithTheme(<PoiDetails poi={poi} language={language} distance={distance} />)

    fireEvent.press(getByText(poi.location.address))
    expect(Clipboard.setString).toHaveBeenCalledWith('Test Address 1, 12345 Test Town')
    expect(showSnackbar).toHaveBeenCalledWith({ text: 'addressCopied' })
  })
})
