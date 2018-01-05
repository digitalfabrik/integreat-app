import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { connect } from 'react-redux'
import Spinner from 'react-spinkit'

import Error from 'modules/common/containers/Error'
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
 * @param hideError {boolean} If you want to hide errors in the render() method
 * @param hideSpinner {boolean} If you want to hide a loading spinner in the render() method
 * @return {buildHOC} Returns a HOC which renders the supplied component as soon as the fetcher succeeded
 */
export function withFetcher (endpointName, hideError = false, hideSpinner = false) {
  return (WrappedComponent) => {
    class Fetcher extends React.Component {
      static displayName = endpointName + 'Fetcher'
      static propTypes = {
        urlParams: PropTypes.objectOf(PropTypes.string),
        className: PropTypes.string,
        requestAction: PropTypes.func.isRequired,
        getEndpoint: PropTypes.func
      }

      static contextTypes = contextTypes

      constructor (props, context) {
        super()
        this.state = {isDataAvailable: false}

        if (props.getEndpoint) {
          this.endpoint = props.getEndpoint(endpointName)
        } else {
          this.endpoint = context.getEndpoint(endpointName)
        }
      }

      componentWillMount () {
        // A store dispatch in the componentWillMount (and therefore a state update) does not cause the props to update
        // before render() in the Fetcher component is called the first time.
        // This causes the <WrappedComponent> to be displayed with outdated props.
        // https://github.com/reactjs/react-redux/issues/210#issuecomment-166055644
        this.fetch(this.props.urlParams)
      }

      componentWillReceiveProps (nextProps) {
        // Dispatch new requestAction to ask the endpoint whether data is available, if:
        // (a) the Fetcher urlParams prop changed or
        // (b) the Fetcher endpoint.payloadName prop changed because of new data in the store (e.g. because a payload has been fetched)
        const endpoint = this.endpoint
        if (endpoint.shouldRefetch(this.props.urlParams, nextProps.urlParams) ||
          this.props[endpoint.payloadName] !== nextProps[endpoint.payloadName]) {
          this.fetch(nextProps.urlParams)
        }
      }

      /**
       * Triggers a new fetch if available
       * @param {object} urlParams The params to use
       */
      fetch (urlParams) {
        if (!urlParams) {
          throw new Error('urlParams are not valid! This could mean your mapStateToUrlParams() returns ' +
            'a undefined value!')
        }
        const storeResponse = this.props.requestAction(urlParams)
        this.setState({isDataAvailable: storeResponse.dataAvailable})
      }

      errorVisible () {
        return !hideError && this.props[this.endpoint.payloadName].error
      }

      render () {
        const payload = this.props[this.endpoint.payloadName]

        if (!this.state.isDataAvailable) {
          if (!hideSpinner) {
            return <Spinner className={cx(style.loading, this.props.className)} name='line-scale-party' />
          } else {
            return <div />
          }
        }

        if (this.errorVisible()) {
          return <Error className={cx(style.loading, this.props.className)} error={payload.error} />
        }

        return <WrappedComponent {...Object.assign({}, this.props, {[this.endpoint.stateName]: payload.data})} /> //todo pass only props which are needed, no internal data
      }
    }

    return Fetcher
  }
}

const createMapStateToProps = (endpointName) => (state, ownProps) => {
  const endpoint = ownProps.getEndpoint(endpointName)
  return ({
    [endpoint.payloadName]: state[endpoint.stateName],
    urlParams: endpoint.mapStateToUrlParams(state)
  })
}

const createMapDispatchToProps = (endpointName) => (dispatch, ownProps) => {
  const endpoint = ownProps.getEndpoint(endpointName)
  return ({
    requestAction: (urlParams) => dispatch(endpoint.requestAction(urlParams))
  })
}

export default (endpointName, hideError, hideSpinner) => {
  const HOC = withFetcher(endpointName, hideError, hideSpinner)
  return (WrappedComponent) => {
    const AnotherWrappedComponent = HOC(WrappedComponent)
    return getContext(contextTypes)(
      connect(createMapStateToProps(endpointName), createMapDispatchToProps(endpointName))(AnotherWrappedComponent))
  }
}
