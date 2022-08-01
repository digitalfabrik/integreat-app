import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'

import { CityModel, ErrorCode, OFFERS_ROUTE, OffersRouteType } from 'api-client'
import CityModelBuilder from 'api-client/src/testing/CityModelBuilder'
import {
  mockUseLoadFromEndpointLoading,
  mockUseLoadFromEndpointOnceWithData,
  mockUseLoadFromEndpointWithError,
} from 'api-client/src/testing/mockUseLoadFromEndpoint'

import createNavigationScreenPropMock from '../../testing/createNavigationPropMock'
import render from '../../testing/render'
import { reportError } from '../../utils/sentry'
import OffersContainer from '../OffersContainer'

jest.mock('../../utils/sentry')
jest.mock('react-i18next')
jest.mock('../../utils/openExternalUrl')
jest.mock('api-client', () => ({
  ...jest.requireActual('api-client'),
  useLoadFromEndpoint: jest.fn(),
}))
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
  const cityCode = 'augsburg'
  const languageCode = 'de'
  const route = {
    key: 'route-id-0',
    params: {
      cityCode,
      languageCode,
    },
    name: OFFERS_ROUTE,
  }
  const errorText = `Failure ${ErrorCode.UnknownError}`
  const cities = new CityModelBuilder(1).build()

  const state = {
    cities: {
      models: cities,
    },
  }
  const mockStore = configureMockStore()
  const store = mockStore(state)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should display offers without a Loading spinner', () => {
    mockUseLoadFromEndpointOnceWithData([])
    const { queryByText } = render(
      <Provider store={store}>
        <OffersContainer navigation={navigation} route={route} />
      </Provider>
    )
    expect(queryByText('Offers')).toBeTruthy()
    expect(queryByText('loading')).toBeFalsy()
    expect(queryByText(errorText)).toBeFalsy()
  })

  it('should display error', () => {
    mockUseLoadFromEndpointWithError('Error')
    const { queryByText } = render(
      <Provider store={store}>
        <OffersContainer navigation={navigation} route={route} />
      </Provider>
    )
    expect(queryByText(errorText)).toBeTruthy()
    expect(queryByText('Offers')).toBeFalsy()
    expect(queryByText('loading')).toBeFalsy()
    expect(reportError).toHaveBeenCalledTimes(1)
  })

  it('should display offers with a Loading spinner', () => {
    mockUseLoadFromEndpointLoading({ data: [] })
    const { queryByText } = render(
      <Provider store={store}>
        <OffersContainer navigation={navigation} route={route} />
      </Provider>
    )
    expect(queryByText('Offers')).toBeTruthy()
    expect(queryByText('loading')).toBeTruthy()
    expect(queryByText(errorText)).toBeFalsy()
  })

  it('should display offers with a loading spinner', () => {
    mockUseLoadFromEndpointLoading()
    const { queryByText } = render(
      <Provider store={store}>
        <OffersContainer navigation={navigation} route={route} />
      </Provider>
    )
    expect(queryByText(errorText)).toBeFalsy()
    expect(queryByText('loading')).toBeTruthy()
    expect(queryByText('Offers')).toBeFalsy()
  })

  it('should display error with loading spinner', () => {
    mockUseLoadFromEndpointLoading({ data: [], error: 'Error' })
    const { queryByText } = render(
      <Provider store={store}>
        <OffersContainer navigation={navigation} route={route} />
      </Provider>
    )
    expect(queryByText(errorText)).toBeTruthy()
    expect(queryByText('loading')).toBeTruthy()
    expect(queryByText('Offers')).toBeFalsy()
  })

  it('should display a page not found error if offers disabled for city', () => {
    const disabledOffersCity = new CityModel({
      name: 'Stadt Augsburg',
      code: 'augsburg',
      live: true,
      eventsEnabled: true,
      offersEnabled: false,
      poisEnabled: true,
      localNewsEnabled: true,
      tunewsEnabled: true,
      sortingName: 'Augsburg',
      prefix: 'Stadt',
      latitude: 48.369696,
      longitude: 10.892578,
      aliases: {
        Konigsbrunn: {
          latitude: 48.267499,
          longitude: 10.889586,
        },
      },
      boundingBox: null,
    })
    const store = mockStore({
      cities: {
        status: 'ready',
        models: [disabledOffersCity],
      },
    })
    mockUseLoadFromEndpointOnceWithData(null)
    const { queryByText } = render(
      <Provider store={store}>
        <OffersContainer navigation={navigation} route={route} />
      </Provider>
    )
    expect(queryByText('Offers')).toBeFalsy()
    expect(queryByText('loading')).toBeFalsy()
    expect(queryByText(errorText)).toBeFalsy()
    expect(queryByText(`Failure ${ErrorCode.PageNotFound}`)).toBeTruthy()
  })
})
