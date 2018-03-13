import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Spinner from 'react-spinkit'

import Failure from 'modules/common/components/Failure'
import style from './withFetcher.css'
import { getContext } from 'recompose'
import Endpoint from '../Endpoint'
import { isEqual } from 'lodash/lang'

const contextTypes = {
  getEndpoint: PropTypes.func
}

/**
 * This function builds a HOC from a component
 * @callback buildHOC
 * @param {React.Component} WrappedComponent
 * @return {React.Component} The HOC
 */

const Loading = () => <Spinner className={style.loading} name='line-scale-party' />

/**
 * This creates a factory for a Higher-Order-Component. The HOC attaches a fetcher to the supplied component.
 * @param endpointName {string} The name of the endpoint to fetch from
 * @param FailureComponent {*} the component which is rendered in error-case, null if no Failure should be rendered.
 * @param LoadingComponent {*} the component which is rendered while loading, null if no loading should be rendered.
 * @return {buildHOC} Returns a HOC which renders the supplied component as soon as the fetcher succeeded
 */
export function withFetcher (endpointName, FailureComponent = Failure, LoadingComponent = Loading) {
  return WrappedComponent => {
    class Fetcher extends React.Component {
      static displayName = `${endpointName}Fetcher`
      static propTypes = {
        state: PropTypes.object.isRequired,
        endpoint: PropTypes.instanceOf(Endpoint).isRequired,
        requestAction: PropTypes.func.isRequired
      }

      static contextTypes = contextTypes

      constructor () {
        super()
        this.state = {isDataAvailable: false}
      }

      componentWillMount () {
        // A store dispatch in the componentWillMount (and therefore a state update) does not cause the props to update
        // before render() in the Fetcher component is called the first time.
        // This causes the <WrappedComponent> to be displayed with outdated props.
        // https://github.com/reactjs/react-redux/issues/210#issuecomment-166055644
        this.tryRequest()
      }

      componentWillReceiveProps (nextProps) {
        // Dispatch new requestAction to ask the endpoint whether data is available, if:
        // (a) the Fetcher endpoint.payloadName prop changed because of new data in the store (e.g. because a payload has been fetched)
        if (!isEqual(this.props.state, nextProps.state) || this.getStatePayload(this.props) !== this.getStatePayload(nextProps)) {
          this.tryRequest()
        }
      }

      getStatePayload (props = this.props) {
        return props.state[this.props.endpoint.stateName]
      }

      /**
       * Tries to trigger a request by dispatching a requestAction
       */
      tryRequest () {
        const storeResponse = this.props.requestAction()
        this.setState({isDataAvailable: storeResponse.dataAvailable})
      }

      render () {
        const payload = this.getStatePayload()

        const allProps = {...this.props}
        // Strip all internal data
        delete allProps.endpoint
        delete allProps.getEndpoint
        delete allProps.state
        delete allProps.requestAction

        if (!this.state.isDataAvailable) {
          return LoadingComponent ? <LoadingComponent {...allProps} /> : null
        }

        if (payload.error) {
          return FailureComponent ? <FailureComponent {...allProps} error={payload.error} /> : null
        }
        return <WrappedComponent {...{...allProps, [this.props.endpoint.stateName]: payload.data}} />
      }
    }

    return Fetcher
  }
}

const createMapStateToProps = endpointName => (state, ownProps) => {
  if (!ownProps.getEndpoint) {
    throw new Error('Invalid context. Did you forget to wrap the withFetcher(...) in a EndpointProvider?')
  }
  const endpoint = ownProps.getEndpoint(endpointName)
  return ({endpoint, state})
}

const createMapDispatchToProps = endpointName => (dispatch, ownProps) => {
  // We already check in createMapStateToProps for ownProps.getEndpoint, which is called earlier
  const endpoint = ownProps.getEndpoint(endpointName)
  return ({
    requestAction: () => dispatch(endpoint.requestAction())
  })
}

export default (endpointName, hideError, hideSpinner) => {
  const HOC = withFetcher(endpointName, hideError, hideSpinner)
  return WrappedComponent => {
    const AnotherWrappedComponent = HOC(WrappedComponent)
    return getContext(contextTypes)(
      connect(createMapStateToProps(endpointName), createMapDispatchToProps(endpointName))(AnotherWrappedComponent))
  }
}
