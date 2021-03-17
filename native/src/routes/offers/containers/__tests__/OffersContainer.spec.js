// @flow

import React from 'react'
import createNavigationScreenPropMock from '../../../../testing/createNavigationPropMock'
import { OFFERS_ROUTE } from 'api-client/src/routes'
import OffersContainer from '../OffersContainer'
import { render } from '@testing-library/react-native'
import ErrorCodes from '../../../../modules/error/ErrorCodes'
import loadFromEndpoint from '../../../../modules/endpoint/loadFromEndpoint'

jest.mock('react-i18next')
jest.mock('../../../../modules/common/openExternalUrl')
jest.mock('../../../../modules/endpoint/loadFromEndpoint', () => jest.fn())

jest.mock('../../components/Offers', () => {
  const Text = require('react-native').Text
  return () => <Text>Offers</Text>
})

jest.mock('../../../../modules/error/containers/FailureContainer', () => {
  const Text = require('react-native').Text
  return ({ code }: {| code: string |}) => <Text>Failure {code}</Text>
})

jest.mock('react-native/Libraries/Components/RefreshControl/RefreshControl', () => {
  const Text = require('react-native').Text
  return ({ refreshing }: {| refreshing: boolean |}) => (refreshing ? <Text>loading</Text> : null)
})

describe('OffersContainer', () => {
  const navigation = createNavigationScreenPropMock()
  const cityCode = 'augsburg'
  const languageCode = 'de'
  const route = { key: 'route-id-0', params: { cityCode, languageCode }, name: OFFERS_ROUTE }
  const errorText = `Failure ${ErrorCodes.UnknownError}`
  const mockLoadFromEndpointOnce = mock => {
    // $FlowFixMe mockImplementationOnce is defined
    loadFromEndpoint.mockImplementationOnce(mock)
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should display offers without a Loading spinner', () => {
    mockLoadFromEndpointOnce((request, setData, _, setLoading) => {
      setData([])
    })
    const { getByText } = render(<OffersContainer navigation={navigation} route={route} />)
    expect(getByText('Offers')).toBeTruthy()
    expect(() => getByText('loading')).toThrow('No instances found with text "loading"')
    expect(() => getByText(errorText)).toThrow(`No instances found with text "${errorText}"`)
  })

  it('should display offers with a Loading spinner', () => {
    mockLoadFromEndpointOnce((request, setData, _, setLoading) => {
      setData([])
      setLoading(true)
    })
    const { getByText } = render(<OffersContainer navigation={navigation} route={route} />)
    expect(getByText('Offers')).toBeTruthy()
    expect(getByText('loading')).toBeTruthy()
    expect(() => getByText(errorText)).toThrow(`No instances found with text "${errorText}"`)
  })

  it('should display error without a loading spinner', () => {
    mockLoadFromEndpointOnce((request, _, setError) => {
      setError(new Error('myError'))
    })
    const { getByText } = render(<OffersContainer navigation={navigation} route={route} />)
    expect(getByText(errorText)).toBeTruthy()
    expect(() => getByText('Offers')).toThrow('No instances found with text "Offers"')
    expect(() => getByText('loading')).toThrow('No instances found with text "loading"')
  })

  it('should display error with spinner', () => {
    mockLoadFromEndpointOnce((request, _, setError, setLoading) => {
      setError(new Error('myError'))
      setLoading(true)
    })
    const { getByText } = render(<OffersContainer navigation={navigation} route={route} />)
    expect(getByText(errorText)).toBeTruthy()
    expect(getByText('loading')).toBeTruthy()
    expect(() => getByText('Offers')).toThrow('No instances found with text "Offers"')
  })
})
