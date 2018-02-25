import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Spinner from 'react-spinkit'

import Failure from 'modules/common/components/Failure'
import style from './withFetcher.css'
import { getContext } from 'recompose'

const contextTypes = {
  getEndpoint: PropTypes.func.isRequired
}

/**
 * This function builds a HOC from a component
 * @callback buildHOC
 * @param {React.Component} WrappedComponent
 * @return {React.Component} The HOC
 */

/**
 * This creates a factory for a Higher-Order-Component. The HOC attaches a fetcher to the supplied component.
 * @param endpointName {string} The name of the endpoint to fetch from
 * @param FailureComponent {*} the component which is rendered in error-case, null if no Failure should be rendered.
 * @param hideSpinner {boolean} If you want to hide a loading spinner in the render() method
 * @return {buildHOC} Returns a HOC which renders the supplied component as soon as the fetcher succeeded
 */
export function withFetcher (endpointName, FailureComponent = Failure, hideSpinner = false) {
  return WrappedComponent => {
    class Fetcher extends React.Component {
      static displayName = `${endpointName}Fetcher`
      static propTypes = {
        state: PropTypes.object.isRequired,
        requestAction: PropTypes.func.isRequired,
        getEndpoint: PropTypes.func
      }

      static contextTypes = contextTypes

      constructor (props, context) {
        super()
        this.state = {isDataAvailable: false}

        if (props.getEndpoint) {
          this.endpoint = props.getEndpoint(endpointName)
        } else if (context && context.getEndpoint) {
          this.endpoint = context.getEndpoint(endpointName)
        } else {
          throw new Error('Invalid context. Did you forget to wrap the withFetcher(...) in a EndpointProvider?')
        }
      }

      componentWillMount () {
        // A store dispatch in the componentWillMount (and therefore a state update) does not cause the props to update
        // before render() in the Fetcher component is called the first time.
        // This causes the <WrappedComponent> to be displayed with outdated props.
        // https://github.com/reactjs/react-redux/issues/210#issuecomment-166055644
        this.fetch(this.props.state)
      }

      componentWillReceiveProps (nextProps) {
        // Dispatch new requestAction to ask the endpoint whether data is available, if:
        // (a) the Fetcher urlParams prop changed or
        // (b) the Fetcher endpoint.payloadName prop changed because of new data in the store (e.g. because a payload has been fetched)
        const endpoint = this.endpoint
        if (endpoint.shouldRefetch(this.props.state, nextProps.state) ||
          this.props[endpoint.payloadName] !== nextProps[endpoint.payloadName]) {
          this.fetch(nextProps.state)
        }
      }

      /**
       * Triggers a new fetch if available
       * @param {object} state The state with the params
       */
      fetch (state) {
        const storeResponse = this.props.requestAction(state)
        this.setState({isDataAvailable: storeResponse.dataAvailable})
      }

      errorVisible () {
        return this.props[this.endpoint.payloadName].error
      }

      render () {
        const payload = this.props[this.endpoint.payloadName]

        if (!this.state.isDataAvailable) {
          if (!hideSpinner) {
            return <Spinner className={style.loading} name='line-scale-party' />
          } else {
            return <div />
          }
        }

        if (this.errorVisible()) {
          return FailureComponent ? <FailureComponent error={payload.error} /> : null
        }

        const allProps = ({...this.props, [this.endpoint.stateName]: payload.data})
        // Strip all internal data
        delete allProps[this.endpoint.payloadName]
        delete allProps.getEndpoint
        delete allProps.state
        delete allProps.requestAction
        return <WrappedComponent {...allProps} />
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
  return ({
    [endpoint.payloadName]: state[endpoint.stateName],
    state: state
  })
}

const createMapDispatchToProps = endpointName => (dispatch, ownProps) => {
  // We already check in createMapStateToProps for ownProps.getEndpoint, which is called earlier
  const endpoint = ownProps.getEndpoint(endpointName)
  return ({
    requestAction: state => dispatch(endpoint.requestAction(state))
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
