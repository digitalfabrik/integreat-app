import { waitFor } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'

import { OFFERS_ROUTE, OffersRouteType } from 'shared'
import { CategoriesMapModelBuilder, LanguageModelBuilder, CityModelBuilder, ErrorCode, OfferModel } from 'shared/api'

import useLoadExtraCityContent, { UseLoadExtraCityContentReturn } from '../../hooks/useLoadExtraCityContent'
import TestingAppContext from '../../testing/TestingAppContext'
import createNavigationScreenPropMock from '../../testing/createNavigationPropMock'
import render from '../../testing/render'
import OffersContainer from '../OffersContainer'

jest.mock('styled-components')
jest.mock('../../hooks/useNavigate', () => () => ({}))
jest.mock('@react-native-community/netinfo')
jest.mock('../../hooks/useLoadExtraCityContent')
jest.mock('../../utils/FetcherModule')
jest.mock('../../utils/sentry')
jest.mock('react-i18next')
jest.mock('../../utils/openExternalUrl')
jest.mock('../Offers', () => {
  const { Text } = require('react-native')

  return () => <Text>Offers</Text>
})
jest.mock('../../components/Failure', () => {
  const { Text } = require('react-native')

  return ({ code }: { code: string }) => <Text>Failure {code}</Text>
})
jest.mock('react-native/Libraries/Components/RefreshControl/RefreshControl', () => {
  const { Text } = require('react-native')

  return ({ refreshing }: { refreshing: boolean }) => (refreshing ? <Text>loading</Text> : null)
})

describe('OffersContainer', () => {
  const navigation = createNavigationScreenPropMock<OffersRouteType>()
  const route = {
    key: 'route-id-0',
    name: OFFERS_ROUTE,
  }
  const errorText = `Failure ${ErrorCode.UnknownError}`

  const cities = new CityModelBuilder(3).build()
  const city = cities[0]!
  const cityDisabledOffers = cities[1]!
  const languages = new LanguageModelBuilder(3).build()
  const language = languages[0]!
  const data = {
    cities,
    languages,
    city,
    language,
    categories: new CategoriesMapModelBuilder(city.code, language.code).build(),
    events: [],
    pois: [],
    extra: [],
    localNews: [],
  }

  const returnValue: UseLoadExtraCityContentReturn<OfferModel[]> = {
    refresh: jest.fn(),
    loading: false,
    error: null,
    data,
  }

  const renderOffersContainer = () =>
    render(
      <TestingAppContext>
        <OffersContainer route={route} navigation={navigation} />
      </TestingAppContext>,
    )

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should display offers without a Loading spinner', () => {
    mocked(useLoadExtraCityContent).mockImplementation(() => returnValue as never)
    const { queryByText } = renderOffersContainer()
    expect(queryByText('Offers')).toBeTruthy()
    expect(queryByText('loading')).toBeFalsy()
    expect(queryByText(errorText)).toBeFalsy()
  })

  it('should display error', () => {
    mocked(useLoadExtraCityContent).mockImplementation(
      () => ({ ...returnValue, error: ErrorCode.UnknownError }) as never,
    )
    const { queryByText } = renderOffersContainer()
    expect(queryByText(errorText)).toBeTruthy()
    expect(queryByText('Offers')).toBeFalsy()
    expect(queryByText('loading')).toBeFalsy()
  })

  it('should display offers with a Loading spinner', async () => {
    mocked(useLoadExtraCityContent).mockImplementation(() => ({ ...returnValue, loading: true }) as never)
    const { queryByText } = renderOffersContainer()
    await waitFor(() => expect(queryByText('Offers')).toBeTruthy())
    expect(queryByText('loading')).toBeTruthy()
    expect(queryByText(errorText)).toBeFalsy()
  })

  it('should display a loading spinner', async () => {
    mocked(useLoadExtraCityContent).mockImplementation(() => ({ ...returnValue, data: null, loading: true }))
    const { queryByText } = renderOffersContainer()
    expect(queryByText(errorText)).toBeFalsy()
    await waitFor(() => expect(queryByText('loading')).toBeTruthy())
    expect(queryByText('Offers')).toBeFalsy()
  })

  it('should display a page not found error if offers disabled for city', async () => {
    mocked(useLoadExtraCityContent).mockImplementation(
      () =>
        ({
          ...returnValue,
          data: { ...data, city: cityDisabledOffers },
        }) as never,
    )
    const { queryByText } = renderOffersContainer()
    await waitFor(() => expect(queryByText('Offers')).toBeFalsy())
    expect(queryByText('loading')).toBeFalsy()
    expect(queryByText(errorText)).toBeFalsy()
    expect(queryByText(`Failure ${ErrorCode.PageNotFound}`)).toBeTruthy()
  })
})
