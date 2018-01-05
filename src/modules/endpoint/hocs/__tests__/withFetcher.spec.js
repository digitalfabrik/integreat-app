import React from 'react'

import { mount, shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'

import EndpointBuilder from '../../EndpointBuilder'
import StoreResponse from '../../StoreResponse'
import Payload from '../../Payload'
import connectedWithFetcher, { withFetcher } from '../withFetcher'
import EndpointProvider from '../../EndpointProvider'

describe('withFetcher', () => {
  const urlParams = {var1: 'a', var2: 'b'}
  const responseOverride = {data: 'random'}
  const endpoint = new EndpointBuilder('endpoint')
    .withUrl('https://someendpoint/{var1}/{var2}/api.json')
    .withMapper((json) => json)
    .withStateMapper().fromFunction(() => (urlParams))
    .withResponseOverride(responseOverride)
    .build()

  // eslint-disable-next-line react/prop-types
  const createComponent = ({endpoint, hideError = false, hideSpinner = false, urlParams = {}, requestAction, classname, otherProps = {[endpoint.payloadName]: new Payload(false)}}) => {
    const HOC = withFetcher(endpoint.stateName, hideError, hideSpinner)

    class WrappedComponent extends React.Component {
      static displayName = 'WrappedComponent'

      render () {
        return <span>WrappedComponent</span>
      }
    }

    const Hoced = HOC(WrappedComponent)

    return <Hoced getEndpoint={() => endpoint}
                  urlParams={urlParams}
                  requestAction={requestAction}
                  classname={classname}
                  {...otherProps} />
  }

  test('should should show error if there is one and it\'s not hidden', () => {
    const hoc = createComponent({
      endpoint,
      hideError: false,
      requestAction: () => new StoreResponse(true),
      otherProps: {[endpoint.payloadName]: new Payload(false, null, 'Yepp... Error time! Wushhh!')}
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

  const mockStore = configureMockStore([thunk])

  describe('connect()', () => {
    test('should map dispatch to props', () => {
      const payload = new Payload(false)
      const store = mockStore({[endpoint.stateName]: payload})
      const HOC = connectedWithFetcher(endpoint.stateName)
      const WrappedComponent = () => <span>WrappedComponent</span>
      const Hoced = HOC(WrappedComponent)

      const tree = mount(
        <Provider store={store}>
          <EndpointProvider endpoints={[endpoint]}>
            <Hoced />
          </EndpointProvider>
        </Provider>
      )

      const wrappedHOCProps = tree.find('endpointFetcher').props()

      expect(store.getActions()).toHaveLength(2) // componentDidMount calls fetch
      expect(store.getActions()).toContainEqual({
        payload: new Payload(false, responseOverride, null, 'https://someendpoint/a/b/api.json', expect.any(Number)),
        type: 'FINISH_FETCH_DATA_ENDPOINT'
      })
      wrappedHOCProps.requestAction({var1: 'c', var2: 'd'})
      expect(store.getActions()).not.toHaveLength(2) // should change after dispatch -> not 2 anymore
      expect(store.getActions()).toContainEqual({
        payload: new Payload(false, responseOverride, null, 'https://someendpoint/c/d/api.json', expect.any(Number)),
        type: 'FINISH_FETCH_DATA_ENDPOINT'
      })
    })

    test('should map state to props', () => {
      /*  The url from the last request. This tells the endpoint that we already have data and displays the wrapped
      component instead of a spinner */
      const requestUrl = 'https://someendpoint/a/b/api.json'
      const payload = new Payload(false, {}, null, requestUrl)
      const store = mockStore({[endpoint.stateName]: payload})
      const HOC = connectedWithFetcher(endpoint.stateName)
      const WrappedComponent = () => <span>WrappedComponent</span>
      const Hoced = HOC(WrappedComponent)

      const tree = mount(
        <Provider store={store}>
          <EndpointProvider endpoints={[endpoint]}>
            <Hoced />
          </EndpointProvider>
        </Provider>
      )

      const wrappedHOCProps = tree.find(WrappedComponent).props()

      expect(wrappedHOCProps).toEqual({
        endpoint: payload.data
      })
    })
  })
})
