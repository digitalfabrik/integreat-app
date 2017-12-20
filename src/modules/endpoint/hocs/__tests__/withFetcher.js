import React from 'react'
import { withFetcher } from '../withFetcher'
import EndpointBuilder from '../../EndpointBuilder'
import StoreResponse from '../../StoreResponse'
import { shallow } from 'enzyme'
import Payload from '../../Payload'

describe('withFetcher', () => {
  const endpoint = new EndpointBuilder('endpoint')
    .withUrl('https://someendpoint/{var1}/{var2}/api.json')
    .withMapper((json) => json)
    .withResponseOverride({})
    .build()

  // eslint-disable-next-line react/prop-types
  const createComponent = ({endpoint, hideError = false, hideSpinner = false, urlParams = {}, requestAction, classname, otherProps = {[endpoint.payloadName]: new Payload(false)}}) => {
    const HOC = withFetcher(endpoint, hideError, hideSpinner)
    const WrappedComponent = () => <span>WrappedComponent</span>
    WrappedComponent.displayName = 'WrappedComponent'
    const Hoced = HOC(WrappedComponent)

    return <Hoced urlParams={urlParams} requestAction={requestAction} classname={classname} {...otherProps}/>
  }

  test('should should show error if there is one and it\'s not hidded', () => {
    const hoc = createComponent({
      endpoint,
      hideError: false,
      requestAction: () => new StoreResponse(true),
      otherProps: {[endpoint.payloadName]: new Payload(false, null, 'Yepp... Error time! Wuschhh!')}
    })

    expect(shallow(hoc)).toMatchSnapshot()
  })

  test('should should show spinner if there is no data yet and it\'s not hidden', () => {
    const hoc = createComponent({
      endpoint,
      hideSpinner: false,
      requestAction: () => new StoreResponse(false),
      otherProps: {[endpoint.payloadName]: new Payload(true)}
    })

    expect(shallow(hoc)).toMatchSnapshot()
  })

  test('should should show nothing if there is no data yet and spinner is hidden', () => {
    const hoc = createComponent({
      endpoint,
      hideSpinner: true,
      requestAction: () => new StoreResponse(false),
      otherProps: {[endpoint.payloadName]: new Payload(true)}
    })

    expect(shallow(hoc)).toMatchSnapshot()
  })

  test('should should show wrapped component if there is data', () => {
    const hoc = createComponent({
      endpoint,
      requestAction: () => new StoreResponse(true),
      otherProps: {[endpoint.payloadName]: new Payload(false, {})}
    })

    expect(shallow(hoc)).toMatchSnapshot()
  })

  test('should fetch when endpoint tells us', () => {
    const endpoint = new EndpointBuilder('endpoint')
      .withUrl('https://someendpoint/{var1}/{var2}/api.json')
      .withMapper((json) => json)
      .withResponseOverride({})
      .withRefetchLogic(() => true) // Refetch always
      .build()

    const mockRequestAction = jest.fn().mockReturnValue(new StoreResponse(false))
    const hoc = shallow(createComponent({
      endpoint,
      requestAction: mockRequestAction
    }))

    hoc.setProps({...hoc.props()}) // Just call componentWillReceiveProps

    expect(mockRequestAction.mock.calls).toHaveLength(2)
  })

  test('should fetch when props change', () => {
    const mockRequestAction = jest.fn().mockReturnValue(new StoreResponse(false))
    const otherProps = {[endpoint.payloadName]: new Payload(false)}
    const hoc = shallow(createComponent({
      endpoint,
      requestAction: mockRequestAction,
      otherProps
    }))

    hoc.setProps({...hoc.props(), ...otherProps}) // No change in props

    // mockRequestAction has been called once in componentWillMount but it shouldn't have been a second time
    expect(mockRequestAction.mock.calls).not.toHaveLength(2)

    const newProps = {[endpoint.payloadName]: new Payload(false)} // newProps !== otherProps (identity)
    hoc.setProps({...hoc.props(), ...newProps})

    expect(mockRequestAction.mock.calls).toHaveLength(2)
  })

  test('should dispatch the correct actions whens fetch occurs', () => {
    const urlParams = {param1: 'a'}
    const otherUrlParams = {param2: 'b'}
    const mockRequestAction = jest.fn().mockReturnValue(new StoreResponse(true))

    const hoc = shallow(createComponent({endpoint, urlParams, requestAction: mockRequestAction}))
    const instance = hoc.instance()

    expect(hoc.state()).toEqual({isDataAvailable: true})

    expect(mockRequestAction).toBeCalledWith(urlParams)

    instance.fetch(otherUrlParams)

    expect(mockRequestAction).toBeCalledWith(otherUrlParams)

    expect(() => instance.fetch(undefined)).toThrow()
  })
})
