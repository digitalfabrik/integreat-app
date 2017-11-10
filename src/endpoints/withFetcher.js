import React from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'
import Spinner from 'react-spinkit'

import Error from 'components/Error'
import style from './Fetcher.css'

function createStateToPropsMapper (endpoint) {
  return (state) => ({
    [endpoint.payloadName]: state[endpoint.stateName],
    options: endpoint.mapStateToOptions(state)
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
    let Fetcher = class extends React.Component {
      static displayName = endpoint.name + 'Fetcher'

      fetch (options) {
        if (!options) {
          throw new Error('options are not valid! This could mean your mapStateToOptions() returns ' +
            'a undefined value!')
        }

        this.props.dispatch(endpoint.requestAction(options, options))
      }

      componentWillMount () {
        this.fetch(this.props.options)
      }

      componentWillUpdate (nextProps) {
        if (endpoint.shouldRefetch(this.props.options, nextProps.options)) {
          this.fetch(nextProps.options)
        }
      }

      errorVisible () {
        return !hideError && this.props[endpoint.payloadName].error
      }

      render () {
        const payload = this.props[endpoint.payloadName]

        if (this.errorVisible()) {
          return <Error className={cx(style.loading, this.props.className)} error={payload.error}/>
        }

        if (!payload.ready()) {
          if (!hideSpinner) {
            return <Spinner className={cx(style.loading, this.props.className)} name='line-scale-party'/>
          } else {
            return <div/>
          }
        }

        return <WrappedComponent {...Object.assign({}, this.props, {[endpoint.stateName]: payload.data})}/>
      }
    }

    return connect(createStateToPropsMapper(endpoint))(Fetcher)
  }
}

export default withFetcher
