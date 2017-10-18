import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { connect } from 'react-redux'
import Spinner from 'react-spinkit'

import Error from 'components/Error'
import style from './Fetcher.css'

function createStateToPropsMapper (endpoint) {
  return (state, prevProps) => {
    const newOptions = Object.assign({}, prevProps.options, endpoint.mapStateToOptions(state))
    const props = {options: newOptions}
    props[endpoint.payloadName] = state[endpoint.stateName]
    return props
  }
}

function withFetcher (endpoint, hideError = false, hideSpinner = false) {
  return (WrappedComponent) => {
    let Fetcher = class extends React.Component {
      static propTypes = {
        options: endpoint.optionsPropType.isRequired,
        className: PropTypes.string
      }

      static defaultProps = {options: {}}

      static displayName = endpoint.name + 'Fetcher'

      fetch (props) {
        const urlParams = endpoint.mapOptionsToUrlParams(props.options)
        if (!urlParams) {
          throw new Error('mapOptionsToUrlParams(options) returned nothing')
        }

        this.props.dispatch(endpoint.fetchEndpointAction(urlParams, props.options))
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
        if (endpoint.shouldRefetch(this.props.options, nextProps.options)) {
          // todo: this will need some more work to test -> another issue as this is getting too big
          this.fetch(nextProps)
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

        return (
          <div className={this.props.className}>
            <WrappedComponent {...Object.assign({}, this.props, {[endpoint.stateName]: payload.data})}/>
          </div>
        )
      }
    }

    return connect(createStateToPropsMapper(endpoint))(Fetcher)
  }
}

export default withFetcher
