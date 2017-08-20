import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { connect } from 'react-redux'
import Spinner from 'react-spinkit'

import Error from 'components/Error'
import style from './Fetcher.css'

function createStateToPropsMapper (endpoint) {
  return (state, prevProps) => {
    const newOptions = Object.assign({}, prevProps.endpointOptions, endpoint.mapStateToOptions(state))
    const props = {endpointOptions: newOptions}
    props[endpoint.payloadName] = state[endpoint.stateName]
    return props
  }
}

function createFetcher (endpoint) {
  let Fetcher = class extends React.Component {
    static propTypes = {
      endpointOptions: endpoint.optionsPropType.isRequired,
      hideError: PropTypes.bool,
      hideSpinner: PropTypes.bool,
      className: PropTypes.string
    }

    static defaultProps = {
      endpointOptions: {}
    }

    static displayName = endpoint.name + 'Fetcher'

    fetch () {
      const urlParams = endpoint.mapOptionsToUrlParams(this.props.endpointOptions)
      if (!urlParams) {
        throw new Error('mapOptionsToUrlParams(options) returned nothing')
      }

      this.props.dispatch(endpoint.fetchEndpointAction(urlParams, this.props.endpointOptions))
    }

    invalidate () {
      this.props.dispatch(endpoint.invalidateAction())
    }

    componentWillUnmount () {
      this.invalidate()
    }

    componentWillMount () {
      this.fetch()
    }

    componentWillUpdate (nextProps) {
      if (endpoint.shouldRefetch(this.props, nextProps)) {   // todo: this will need some more work to test -> an other issue as
        // this is getting too big
        this.fetch(nextProps)
      }
    }

    render () {
      let payload = this.props[endpoint.payloadName]

      if (!this.props.hideError && payload.error) {
        return <Error className={cx(style.loading, this.props.className)} error={payload.error}/>
      }

      if (!this.props.hideSpinner && !payload.ready()) {
        return <Spinner className={cx(style.loading, this.props.className)} name='line-scale-party'/>
      } else if (payload.ready()) {
        const newProps = {
          [endpoint.stateName]: payload.data,  // The actual Payload data
          [endpoint.payloadName]: payload      // The actual Payload, called: `${stateName}Payload`
        }

        return (
          <div className={this.props.className}>
            {
              React.Children.map(this.props.children,
                (child) => React.cloneElement(child, Object.assign({}, this.props, newProps)))
            }
          </div>
        )
      } else {
        return <div className={this.props.className}/>
      }
    }
  }

  connect(createStateToPropsMapper(endpoint))(Fetcher)
}

export default {createFetcher}
