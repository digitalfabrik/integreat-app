import React from 'react'
import { withFetcher } from '../withFetcher'
import { shallow } from 'enzyme'
import EndpointBuilder from '../../EndpointBuilder'
import StoreResponse from '../../StoreResponse'

describe('withFetcher', () => {
  const endpoint = new EndpointBuilder('endpoint')
    .withUrl('https://someendpoint/{var1}/{var2}/api.json')
    .withMapper((json) => json)
    .withResponseOverride({})
    .build()

  const shallowHOC = ({endpoint, hideError = false, hideSpinner = false, urlParams = {}, requestAction, classname, otherProps = {}}) => {
    const HOC = withFetcher(endpoint, hideError, hideSpinner)
    const Hoced = HOC(() => <span>Text</span>)

    return shallow(<Hoced urlParams={urlParams} requestAction={requestAction} classname={classname} {...otherProps}/>)
  }

  test('should should show error if there is one and it\'s not hidded', () => {

  })

  test('should fetch when endpoint tells us', () => {
    const endpoint = new EndpointBuilder('endpoint')
      .withUrl('https://someendpoint/{var1}/{var2}/api.json')
      .withMapper((json) => json)
      .withResponseOverride({})
      .withRefetchLogic(() => true) // Refetch always
      .build()

    const mockRequestAction = jest.fn().mockReturnValue(new StoreResponse(false))
    const hoc = shallowHOC({
      endpoint,
      requestAction: mockRequestAction
    })

    hoc.setProps({...hoc.props()}) // Just call componentWillReceiveProps

    expect(mockRequestAction.mock.calls).toHaveLength(2)
  })

  test('should fetch when props change', () => {
    const mockRequestAction = jest.fn().mockReturnValue(new StoreResponse(false))
    const otherProps = {[endpoint.payloadName]: {key: 'a'}}
    const hoc = shallowHOC({
      endpoint,
      requestAction: mockRequestAction,
      otherProps
    })

    hoc.setProps({...hoc.props(), ...otherProps}) // No change in props

    expect(mockRequestAction.mock.calls).not.toHaveLength(2) /* mockRequestAction has been called once in componentWillMount
                                                                but it shouldn't have been a second time */

    const newProps = {[endpoint.payloadName]: {key: 'b'}}
    hoc.setProps({...hoc.props(), ...newProps})

    expect(mockRequestAction.mock.calls).toHaveLength(2)
  })

  test('should dispatch the correct actions whens fetch occurs', () => {
    const urlParams = {param1: 'a'}
    const otherUrlParams = {param2: 'b'}
    const mockRequestAction = jest.fn().mockReturnValue(new StoreResponse(false))

    const instance = shallowHOC({endpoint, urlParams, requestAction: mockRequestAction}).instance()

    expect(mockRequestAction).toBeCalledWith(urlParams)

    instance.fetch(otherUrlParams)

    expect(mockRequestAction).toBeCalledWith(otherUrlParams)

    expect(() => instance.fetch(undefined)).toThrow()
  })
})
