import React from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'
import Spinner from 'react-spinkit'

import Error from 'modules/common/containers'
import style from './withFetcher.css'

function createStateToPropsMapper (endpoint) {
  return (state) => ({
    [endpoint.payloadName]: state[endpoint.stateName],
    urlParams: endpoint.mapStateToUrlParams(state)
  })
}

/**
 * This function builds a HOC from a component
 * @function buildHOC
 * @param {React.Component} WrappedComponent
 * @return {React.Component} The HOC
 */

/**
 * This creates a factory for a Higher-Order-Component. The HOC attaches a fetcher to the supplied component.
 * @param endpoint {Endpoint} The endpoint to fetch from
 * @param hideError {boolean} If you want to hide errors in the render() method
 * @param hideSpinner {boolean} If you want to hide a loading spinner in the render() method
 * @return {buildHOC} Returns a HOC which renders the supplied component as soon as the fetcher succeeded
 */
function withFetcher (endpoint, hideError = false, hideSpinner = false) {
  return (WrappedComponent) => {
    class Fetcher extends React.Component {
      static displayName = endpoint.name + 'Fetcher'

      constructor () {
        super()
        this.state = { isDataAvailable: false }
      }

      componentWillMount () {
        // A store dispatch in the componentWillMount (and therefore a state update) does not cause the props to update
        // before render() in the Fetcher component is called the first time.
        // This causes the <WrappedComponent> to be displayed with outdated props.
        // https://github.com/reactjs/react-redux/issues/210#issuecomment-166055644
        this.fetch(this.props.urlParams)
      }

      componentWillUpdate (nextProps) {
        // Dispatch new requestAction to ask the endpoint whether data is available, if:
        // (a) the Fetcher urlParams prop changed or
        // (b) the Fetcher endpoint.payloadName prop changed because of new data in the store (e.g. because a payload has been fetched)
        if (endpoint.shouldRefetch(this.props.urlParams, nextProps.urlParams) || this.props[endpoint.payloadName] !== nextProps[endpoint.payloadName]) {
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
        const isDataAvailable = this.props.dispatch(endpoint.requestAction(urlParams))
        this.setState({ isDataAvailable })
      }

      errorVisible () {
        return !hideError && this.props[endpoint.payloadName].error
      }

      render () {
        const payload = this.props[endpoint.payloadName]

        if (!this.state.isDataAvailable) {
          if (!hideSpinner) {
            return <Spinner className={cx(style.loading, this.props.className)} name='line-scale-party'/>
          } else {
            return <div/>
          }
        }

        if (this.errorVisible()) {
          return <Error className={cx(style.loading, this.props.className)} error={payload.error}/>
        }

        return <WrappedComponent {...Object.assign({}, this.props, {[endpoint.stateName]: payload.data})}/>
      }
    }

    return connect(createStateToPropsMapper(endpoint))(Fetcher)
  }
}

export default withFetcher
