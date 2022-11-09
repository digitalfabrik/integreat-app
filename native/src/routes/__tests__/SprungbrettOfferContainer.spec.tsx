import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'

import { CityModel, ErrorCode, SPRUNGBRETT_OFFER_ROUTE, SprungbrettOfferRouteType } from 'api-client'
import CityModelBuilder from 'api-client/src/testing/CityModelBuilder'
import {
  mockUseLoadFromEndpointLoading,
  mockUseLoadFromEndpointOnceWithData,
  mockUseLoadFromEndpointWithError,
} from 'api-client/src/testing/mockUseLoadFromEndpoint'

import createNavigationScreenPropMock from '../../testing/createNavigationPropMock'
import render from '../../testing/render'
import { reportError } from '../../utils/sentry'
import SprungbrettOfferContainer from '../SprungbrettOfferContainer'

jest.mock('../../utils/sentry')
jest.mock('react-i18next')
jest.mock('../../utils/openExternalUrl')
jest.mock('api-client', () => ({
  ...jest.requireActual('api-client'),
  useLoadFromEndpoint: jest.fn(),
}))
jest.mock('../SprungbrettOffer', () => {
  const { Text } = require('react-native')

  return () => <Text>SprungbrettOffer</Text>
})
jest.mock('../../components/Failure', () => {
  const { Text } = require('react-native')

  return ({ code }: { code: string }) => <Text>Failure {code}</Text>
})
jest.mock('react-native/Libraries/Components/RefreshControl/RefreshControl', () => {
  const { Text } = require('react-native')

  return ({ refreshing }: { refreshing: boolean }) => (refreshing ? <Text>loading</Text> : null)
})

describe('SprungbrettOfferContainer', () => {
  const navigation = createNavigationScreenPropMock<SprungbrettOfferRouteType>()
  const cityCode = 'augsburg'
  const languageCode = 'de'
  const route = {
    key: 'route-id-0',
    params: {
      cityCode,
      languageCode,
    },
    name: SPRUNGBRETT_OFFER_ROUTE,
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
    const { queryByText, getByText } = render(
      <Provider store={store}>
        <SprungbrettOfferContainer navigation={navigation} route={route} />
      </Provider>
    )
    expect(getByText('SprungbrettOffer')).toBeTruthy()
    expect(queryByText('loading')).toBeFalsy()
    expect(queryByText(errorText)).toBeFalsy()
  })

  it('should display error without a loading spinner', () => {
    mockUseLoadFromEndpointWithError('Error')
    const { queryByText, getByText } = render(
      <Provider store={store}>
        <SprungbrettOfferContainer navigation={navigation} route={route} />
      </Provider>
    )
    expect(getByText(errorText)).toBeTruthy()
    expect(queryByText('SprungbrettOffer')).toBeFalsy()
    expect(queryByText('loading')).toBeFalsy()
    expect(reportError).toHaveBeenCalledTimes(1)
  })

  it('should display a loading spinner', () => {
    mockUseLoadFromEndpointLoading()
    const { queryByText, getByText } = render(
      <Provider store={store}>
        <SprungbrettOfferContainer navigation={navigation} route={route} />
      </Provider>
    )
    expect(queryByText(errorText)).toBeFalsy()
    expect(getByText('loading')).toBeTruthy()
    expect(queryByText('SprungbrettOffer')).toBeFalsy()
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

    const { queryByText, getByText } = render(
      <Provider store={store}>
        <SprungbrettOfferContainer navigation={navigation} route={route} />
      </Provider>
    )
    expect(queryByText('Offers')).toBeFalsy()
    expect(queryByText('loading')).toBeFalsy()
    expect(queryByText(errorText)).toBeFalsy()
    expect(getByText(`Failure ${ErrorCode.PageNotFound}`)).toBeTruthy()
  })
})