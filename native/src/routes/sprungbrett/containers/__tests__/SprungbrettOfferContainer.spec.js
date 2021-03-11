// @flow

import React from 'react'
import createNavigationScreenPropMock from '../../../../testing/createNavigationPropMock'
import { SPRUNGBRETT_OFFER_ROUTE } from 'api-client/src/routes'
import SprungbrettOfferContainer from '../SprungbrettOfferContainer'
import { render } from '@testing-library/react-native'
import ErrorCodes from '../../../../modules/error/ErrorCodes'
import loadFromEndpoint from '../../../../modules/endpoint/loadFromEndpoint'

jest.mock('react-i18next')
jest.mock('../../../../modules/common/openExternalUrl')
jest.mock('../../../../modules/endpoint/loadFromEndpoint', () => jest.fn())

jest.mock('../../components/SprungbrettOffer', () => {
  const Text = require('react-native').Text
  return () => <Text>SprungbrettOffer</Text>
})

jest.mock('../../../../modules/error/containers/FailureContainer', () => {
  const Text = require('react-native').Text
  return ({ code }: {| code: string |}) => <Text>Failure {code}</Text>
})

jest.mock('react-native/Libraries/Components/RefreshControl/RefreshControl', () => {
  const Text = require('react-native').Text
  return ({ refreshing }: {| refreshing: boolean |}) => (refreshing ? <Text>loading</Text> : null)
})

describe('SprungbrettOfferContainer', () => {
  const navigation = createNavigationScreenPropMock()
  const cityCode = 'augsburg'
  const languageCode = 'de'
  const title = 'Sprungbrett'
  const apiUrl = 'https://my.sprung.br/ett/api'
  const alias = 'sprungbrett'
  const route = {
    key: 'route-id-0',
    params: { cityCode, languageCode, title, apiUrl, alias },
    name: SPRUNGBRETT_OFFER_ROUTE
  }
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
    const { getByText } = render(<SprungbrettOfferContainer navigation={navigation} route={route} />)
    expect(getByText('SprungbrettOffer')).toBeTruthy()
    expect(() => getByText('loading')).toThrow('No instances found with text "loading"')
    expect(() => getByText(errorText)).toThrow(`No instances found with text "${errorText}"`)
  })

  it('should display offers with a Loading spinner', () => {
    mockLoadFromEndpointOnce((request, setData, _, setLoading) => {
      setData([])
      setLoading(true)
    })
    const { getByText } = render(<SprungbrettOfferContainer navigation={navigation} route={route} />)
    expect(getByText('SprungbrettOffer')).toBeTruthy()
    expect(getByText('loading')).toBeTruthy()
    expect(() => getByText(errorText)).toThrow(`No instances found with text "${errorText}"`)
  })

  it('should display error without a loading spinner', () => {
    mockLoadFromEndpointOnce((request, _, setError) => {
      setError(new Error('myError'))
    })
    const { getByText } = render(<SprungbrettOfferContainer navigation={navigation} route={route} />)
    expect(getByText(errorText)).toBeTruthy()
    expect(() => getByText('SprungbrettOffer')).toThrow('No instances found with text "SprungbrettOffer"')
    expect(() => getByText('loading')).toThrow('No instances found with text "loading"')
  })

  it('should display error with spinner', () => {
    mockLoadFromEndpointOnce((request, _, setError, setLoading) => {
      setError(new Error('myError'))
      setLoading(true)
    })
    const { getByText } = render(<SprungbrettOfferContainer navigation={navigation} route={route} />)
    expect(getByText(errorText)).toBeTruthy()
    expect(getByText('loading')).toBeTruthy()
    expect(() => getByText('SprungbrettOffer')).toThrow('No instances found with text "SprungbrettOffer"')
  })
})
