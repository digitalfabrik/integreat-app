import Clipboard from '@react-native-clipboard/clipboard'
import { fireEvent, waitFor } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'

import { PoiModelBuilder, prepareFeatureLocation } from 'api-client'

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
jest.mock('../NativeHtml', () => {
  const { Text } = require('react-native')
  return ({ content }: { content: string }) => <Text>{content}</Text>
})
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
  const userLocation: [number, number] = [29.97984, 31.13385]
  const language = 'de'

  it('should render poi information', () => {
    const poi = pois[0]!
    const feature = prepareFeatureLocation(poi, userLocation, [])!

    const { getByText } = renderWithTheme(<PoiDetails poi={poi} feature={feature} language={language} />)

    expect(getByText(poi.title)).toBeTruthy()
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    expect(getByText(poi.category?.name!)).toBeTruthy()
    expect(getByText('distanceKilometre', { exact: false })).toBeTruthy()
    expect(getByText(poi.location.address)).toBeTruthy()
    expect(getByText(`${poi.location.postcode} ${poi.location.town}`)).toBeTruthy()
    expect(getByText('description')).toBeTruthy()
    expect(getByText(poi.content)).toBeTruthy()

    expect(getByText('contactInformation')).toBeTruthy()
    expect(getByText(poi.website!)).toBeTruthy()
    expect(getByText(poi.phoneNumber!)).toBeTruthy()
    expect(getByText(poi.email!)).toBeTruthy()
  })

  it('should not render distance if there is no user location', () => {
    const poi = pois[0]!
    const feature = prepareFeatureLocation(poi, null, [])!

    const { queryByText } = renderWithTheme(<PoiDetails poi={poi} feature={feature} language={language} />)

    expect(queryByText('distanceKilometre', { exact: false })).toBeFalsy()
  })

  it('should not render contact information if there is none', () => {
    const poiWithoutContactInformation = pois[1]!
    const feature = prepareFeatureLocation(poiWithoutContactInformation, null, [])!

    const { queryByText } = renderWithTheme(
      <PoiDetails poi={poiWithoutContactInformation} feature={feature} language={language} />
    )

    expect(queryByText('contactInformation')).toBeFalsy()
  })

  it('should open external maps app on icon click', async () => {
    const poi = pois[0]!
    const feature = prepareFeatureLocation(poi, userLocation, [])!

    const { getByLabelText } = renderWithTheme(<PoiDetails poi={poi} feature={feature} language={language} />)

    fireEvent.press(getByLabelText('openExternalMaps'))
    const externalMapsUrl = 'maps:29.979848,31.133859?q=Test Title, Test Address 1, 12345 Test Town'
    await waitFor(() => expect(openExternalUrl).toHaveBeenCalledWith(externalMapsUrl, expect.any(Function)))
  })

  it('should copy address to clipboard', () => {
    const poi = pois[0]!
    const feature = prepareFeatureLocation(poi, userLocation, [])!

    const { getByText } = renderWithTheme(<PoiDetails poi={poi} feature={feature} language={language} />)

    fireEvent.press(getByText(poi.location.address))
    expect(Clipboard.setString).toHaveBeenCalledWith('Test Address 1, 12345 Test Town')
    expect(showSnackbar).toHaveBeenCalledWith({ text: 'addressCopied' })
  })
})
