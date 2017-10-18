import React from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'
import Spinner from 'react-spinkit'

import Error from 'components/Error'
import style from './Fetcher.css'

function createStateToPropsMapper (endpoint) {
  return (state) => ({
    [endpoint.payloadName]: state[endpoint.stateName],
    stateOptions: endpoint.mapStateToStateOptions(state)
  })
}

function withFetcher (endpoint, hideError = false, hideSpinner = false) {
  return (WrappedComponent) => {
    let Fetcher = class extends React.Component {
      static displayName = endpoint.name + 'Fetcher'

      fetch () {
        const stateOptions = this.props.stateOptions
        if (!stateOptions) {
          throw new Error('stateOptions are not valid! This could mean your mapStateToStateOptions() returns ' +
            'a undefined value!')
        }

        this.props.dispatch(endpoint.fetchEndpointAction(stateOptions))
      }

      invalidate () {
        this.props.dispatch(endpoint.invalidateAction())
      }

      componentWillUnmount () {
        this.invalidate()
      }

      componentWillMount () {
        this.fetch(this.props)
      }

      componentWillUpdate (nextProps) {
        if (endpoint.shouldRefetch(this.props.stateOptions, nextProps.stateOptions)) {
          // todo: this will need some more work to test -> another issue as this is getting too big
          this.fetch()
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
