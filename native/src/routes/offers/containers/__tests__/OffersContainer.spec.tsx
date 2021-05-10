import React from 'react'
import { Provider } from 'react-redux'
import createNavigationScreenPropMock from '../../../../testing/createNavigationPropMock'
import { OFFERS_ROUTE } from 'api-client/src/routes'
import OffersContainer from '../OffersContainer'
import { render } from '@testing-library/react-native'
import { ErrorCode } from '../../../../modules/error/ErrorCodes'
import { useLoadFromEndpoint } from '../../../../modules/endpoint/hooks/useLoadFromEndpoint'
import configureMockStore from 'redux-mock-store'
import CityModelBuilder from 'api-client/src/testing/CityModelBuilder'
import { CityModel } from 'api-client'
jest.mock('react-i18next')
jest.mock('../../../../modules/common/openExternalUrl')
jest.mock('../../../../modules/endpoint/hooks/useLoadFromEndpoint', () => ({
  useLoadFromEndpoint: jest.fn()
}))
jest.mock('../../components/Offers', () => {
  const Text = require('react-native').Text

  return () => <Text>Offers</Text>
})
jest.mock('../../../../modules/error/containers/FailureContainer', () => {
  const Text = require('react-native').Text

  return ({ code }: { code: string }) => <Text>Failure {code}</Text>
})
jest.mock('react-native/Libraries/Components/RefreshControl/RefreshControl', () => {
  const Text = require('react-native').Text

  return ({ refreshing }: { refreshing: boolean }) => (refreshing ? <Text>loading</Text> : null)
})
describe('OffersContainer', () => {
  const navigation = createNavigationScreenPropMock()
  const cityCode = 'augsburg'
  const languageCode = 'de'
  const route = {
    key: 'route-id-0',
    params: {
      cityCode,
      languageCode
    },
    name: OFFERS_ROUTE
  }
  const errorText = `Failure ${ErrorCode.UnknownError}`
  const cities = new CityModelBuilder(1).build()

  const refresh = () => {}

  const state = {
    cities: {
      models: cities
    }
  }
  const mockStore = configureMockStore()
  const store = mockStore(state)

  const mockUseLoadFromEndpointOnce = mock => {
    // $FlowFixMe mockImplementationOnce is defined
    useLoadFromEndpoint.mockImplementationOnce(mock)
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('should display offers without a Loading spinner', () => {
    mockUseLoadFromEndpointOnce(() => ({
      data: [],
      loading: false,
      error: null,
      refresh
    }))
    const { queryByText } = render(
      <Provider store={store}>
        <OffersContainer navigation={navigation} route={route} />
      </Provider>
    )
    expect(queryByText('Offers')).toBeTruthy()
    expect(queryByText('loading')).toBeFalsy()
    expect(queryByText(errorText)).toBeFalsy()
  })
  it('should display offers with a Loading spinner', () => {
    mockUseLoadFromEndpointOnce(() => ({
      data: [],
      loading: true,
      error: null,
      refresh
    }))
    const { queryByText } = render(
      <Provider store={store}>
        <OffersContainer navigation={navigation} route={route} />
      </Provider>
    )
    expect(queryByText('Offers')).toBeTruthy()
    expect(queryByText('loading')).toBeTruthy()
    expect(queryByText(errorText)).toBeFalsy()
  })
  it('should display error without a loading spinner', () => {
    mockUseLoadFromEndpointOnce(() => ({
      data: [],
      loading: false,
      error: new Error('myError'),
      refresh
    }))
    const { queryByText } = render(
      <Provider store={store}>
        <OffersContainer navigation={navigation} route={route} />
      </Provider>
    )
    expect(queryByText(errorText)).toBeTruthy()
    expect(queryByText('Offers')).toBeFalsy()
    expect(queryByText('loading')).toBeFalsy()
  })
  it('should display error with spinner', () => {
    mockUseLoadFromEndpointOnce(() => ({
      data: [],
      loading: true,
      error: new Error('myError'),
      refresh
    }))
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
      pushNotificationsEnabled: true,
      tunewsEnabled: true,
      sortingName: 'Augsburg',
      prefix: 'Stadt',
      latitude: 48.369696,
      longitude: 10.892578,
      aliases: {
        Konigsbrunn: {
          latitude: 48.267499,
          longitude: 10.889586
        }
      }
    })
    const store = mockStore({
      cities: {
        models: [disabledOffersCity]
      }
    })
    mockUseLoadFromEndpointOnce(() => ({
      data: null,
      loading: false,
      error: null,
      refresh
    }))
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
