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

function withFetcher (endpoint, hideError = false, hideSpinner = false) {
  return (WrappedComponent) => {
    let Fetcher = class extends React.Component {
      static displayName = endpoint.name + 'Fetcher'

      constructor () {
        super()
        this.state = { isDataAvailable: false }
      }

      fetch (options) {
        if (!options) {
          throw new Error('options are not valid! This could mean your mapStateToOptions() returns ' +
            'a undefined value!')
        }
        const isDataAvailable = this.props.dispatch(endpoint.requestAction(options, options))
        this.setIsDataAvailable(isDataAvailable)
      }

      setIsDataAvailable (isDataAvailable) {
        this.setState({ isDataAvailable })
      }

      componentWillMount () {
        // We need to have this discussion in mind, when building the fetcher architecture,
        // because a store dispatch in the componentWillMount has no immediate effect on the props from connect() for
        // the first call of render() (and therefore the <WrappedComponent> would have been mounted for one moment, if
        // we just checked to the payload.ready() prop)
        // https://github.com/reactjs/react-redux/issues/210#issuecomment-166055644
        this.fetch(this.props.options)
      }

      componentWillUpdate (nextProps) {
        // Dispatch new RequestAction to ask the endpoint whether the fetcher can display the data, if
        // (a) the endpoint properties change or
        // (b) the fetcher receives new payload information from the store (e.g. because a payload has been fetched)
        if (endpoint.shouldRefetch(this.props.options, nextProps.options) || this.props[endpoint.payloadName] !== nextProps[endpoint.payloadName]) {
          this.fetch(nextProps.options)
        }
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
