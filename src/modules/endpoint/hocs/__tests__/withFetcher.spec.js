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
  const responseOverride = {data: 'random'}
  const endpoint = new EndpointBuilder('someEndpoint') // fixme can not be called endpoint...
    .withStateToUrlMapper(state => `https://someendpoint/${state.var1}/${state.var2}/api.json`)
    .withMapper(json => json)
    .withResponseOverride(responseOverride)
    .build()

  // eslint-disable-next-line react/prop-types
  const createComponent = ({endpoint, FailureComponent, hideSpinner = false, state = {[endpoint.stateName]: new Payload(false)}, requestAction}) => {
    const HOC = withFetcher(endpoint.stateName, FailureComponent, hideSpinner)

    class WrappedComponent extends React.Component {
      static displayName = 'WrappedComponent'

      render () {
        return <span>WrappedComponent</span>
      }
    }

    const Hoced = HOC(WrappedComponent)

    return <Hoced endpoint={endpoint}
                  state={state}
                  requestAction={requestAction} />
  }

  it('should show default Failure if there is an error', () => {
    const hoc = createComponent({
      endpoint,
      requestAction: () => new StoreResponse(true),
      state: {[endpoint.stateName]: new Payload(false, null, 'Yepp... Error time! Wushhh!')}
    })

    expect(shallow(hoc)).toMatchSnapshot()
  })

  it('should show custom FailureComponent if there is an error', () => {
    const MockedFailureComponent = () => <div />
    const hoc = createComponent({
      endpoint,
      FailureComponent: MockedFailureComponent,
      requestAction: () => new StoreResponse(true),
      state: {[endpoint.stateName]: new Payload(false, null, 'Yepp... Error time! Wushhh!')}
    })

    expect(shallow(hoc)).toMatchSnapshot()
  })

  it('should render nothing if there is an error and FailureComponent is null', () => {
    const hoc = createComponent({
      endpoint,
      FailureComponent: null,
      requestAction: () => new StoreResponse(true),
      state: {[endpoint.stateName]: new Payload(false, null, 'Yepp... Error time! Wushhh!')}
    })

    expect(shallow(hoc)).toMatchSnapshot()
  })

  it('should show spinner if there is no data yet and it\'s not hidden', () => {
    const hoc = createComponent({
      endpoint,
      hideSpinner: false,
      requestAction: () => new StoreResponse(false),
      state: {[endpoint.stateName]: new Payload(true)}
    })

    expect(shallow(hoc)).toMatchSnapshot()
  })

  it('should show nothing if there is no data yet and spinner is hidden', () => {
    const hoc = createComponent({
      endpoint,
      hideSpinner: true,
      requestAction: () => new StoreResponse(false),
      state: {[endpoint.stateName]: new Payload(true)}
    })

    expect(shallow(hoc)).toMatchSnapshot()
  })

  it('should show wrapped component if there is data', () => {
    const hoc = createComponent({
      endpoint,
      requestAction: () => new StoreResponse(true),
      state: {[endpoint.stateName]: new Payload(false, {})}
    })

    expect(shallow(hoc)).toMatchSnapshot()
  })

  it('should fetch when endpoint tells us', () => {
    const endpoint = new EndpointBuilder('endpoint')
      .withStateToUrlMapper(state => `https://someendpoint/${state.var1}/${state.var2}/api.json`)
      .withMapper(json => json)
      .withResponseOverride({})
      .build()

    const mockRequestAction = jest.fn().mockReturnValue(new StoreResponse(false))
    const hoc = shallow(createComponent({
      endpoint,
      requestAction: mockRequestAction
    }))

    hoc.setProps({...hoc.props()}) // Just call componentWillReceiveProps

    expect(mockRequestAction.mock.calls).toHaveLength(1)
  })

  it('should fetch when state changes', () => {
    const mockRequestAction = jest.fn().mockReturnValue(new StoreResponse(false))
    const state = {[endpoint.stateName]: new Payload(false)}
    const hoc = shallow(createComponent({
      endpoint,
      requestAction: mockRequestAction,
      state
    }))

    hoc.setProps({...hoc.props(), state}) // No change in props

    // mockRequestAction has been called once in componentWillMount but it shouldn't have been a second time
    expect(mockRequestAction.mock.calls).not.toHaveLength(2)

    const newState = {[endpoint.stateName]: new Payload(false)} // neState !== state (identity)
    hoc.setProps({...hoc.props(), state: newState})

    expect(mockRequestAction.mock.calls).toHaveLength(2)
  })

  it('should dispatch the correct actions whens fetch occurs', () => {
    const state = {param1: 'a', [endpoint.stateName]: new Payload(false)}
    const mockRequestAction = jest.fn().mockReturnValue(new StoreResponse(true))

    const hoc = shallow(createComponent({endpoint, state, requestAction: mockRequestAction}))

    expect(hoc.state()).toEqual({isDataAvailable: true})

    expect(mockRequestAction).toBeCalled()
  })

  it('should throw error if there is no endpoint provided', () => {
    const HOC = withFetcher(endpoint.stateName)
    const Hoced = HOC(() => <span>WrappedComponent</span>)

    expect(() => shallow(<Hoced state={{}}
                                requestAction={() => new StoreResponse(true)} />)).toThrowErrorMatchingSnapshot()
  })

  describe('connect()', () => {
    const mockStore = configureMockStore([thunk])

    it('should throw if endpoint provider is missing', () => {
      const payload = new Payload(false)
      const store = mockStore({[endpoint.stateName]: payload})
      const HOC = connectedWithFetcher(endpoint.stateName)
      const WrappedComponent = () => <span>WrappedComponent</span>
      const Hoced = HOC(WrappedComponent)

      expect(() => mount(
        <Provider store={store}>
          <Hoced />
        </Provider>
      )).toThrowErrorMatchingSnapshot()
    })

    it('should map dispatch to props', () => {
      const payload = new Payload(false)
      const store = mockStore({[endpoint.stateName]: payload, var1: 'a', var2: 'b'})
      const HOC = connectedWithFetcher(endpoint.stateName)
      const WrappedComponent = () => <span>WrappedComponent</span>
      const Hoced = HOC(WrappedComponent)

      mount(
        <Provider store={store}>
          <EndpointProvider endpoints={[endpoint]}>
            <Hoced />
          </EndpointProvider>
        </Provider>
      )

      expect(store.getActions()).toHaveLength(2) // componentDidMount calls fetch
      expect(store.getActions()).toContainEqual({
        payload: new Payload(false, responseOverride, null, 'https://someendpoint/a/b/api.json', expect.any(Number)),
        type: 'FINISH_FETCH_DATA_SOMEENDPOINT'
      })
    })

    it('should map state to props', () => {
      /*  The url from the last request. This tells the endpoint that we already have data and displays the wrapped
      component instead of a spinner */
      const requestUrl = 'https://someendpoint/a/b/api.json'
      const payload = new Payload(false, {}, null, requestUrl)
      const store = mockStore({[endpoint.stateName]: payload, var1: 'a', var2: 'b'})
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

      console.log(tree.debug())

      const wrappedHOCProps = tree.find(WrappedComponent).props()

      expect(wrappedHOCProps).toEqual({
        [endpoint.stateName]: payload.data
      })
    })
  })
})
