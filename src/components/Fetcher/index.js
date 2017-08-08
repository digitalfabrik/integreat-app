import React from 'react'
import PropTypes from 'prop-types'
import Spinner from 'react-spinkit'
import { connect } from 'react-redux'

import LANGUAGE_FETCHER from 'endpoints/language'
import PAGE_ENDPOINT from 'endpoints/page'
import DISCLAIMER_FETCHER from 'endpoints/disclaimer'
import LOCATION_FETCHER from 'endpoints/location'

import Error from 'components/Error'

import style from './style.css'

function createFetcher (endpoint, createUrlOptions, createUrlTransformOptions) {
  let statePayloadName = endpoint.name
  let payloadName = statePayloadName + 'Payload'

  function mapStateToProps (state) {
    let props = {
      language: state.language.language
    }
    props[payloadName] = state[statePayloadName]
    return props
  }

  let Fetcher = class extends React.Component {
    static propTypes = {
      hideError: PropTypes.bool
    }

    componentWillUnmount () {
      this.props.dispatch(endpoint.invalidateAction())
    }

    componentWillMount () {
      this.props.dispatch(endpoint.fetchEndpointAction(createUrlOptions(this.props), createUrlTransformOptions(this.props)))
    }

    render () {
      let payload = this.props[payloadName]

      if (!this.props.hideError && payload.error) {
        return <Error error={payload.error}/>
      }

      if (payload.ready()) {
        let newProps = {}
        newProps[statePayloadName] = payload.data
        newProps[payloadName] = payload

        return (
          <div>
            {React.Children.map(this.props.children, (child) => React.cloneElement(child, newProps))}
          </div>
        )
      } else {
        return <Spinner className={style.loading} name='line-scale-party'/>
      }
    }
  }

  return connect(mapStateToProps)(Fetcher)
}

const BIRTH_OF_UNIVERSE = new Date(0).toISOString().split('.')[0] + 'Z'
export const PageFetcher = createFetcher(PAGE_ENDPOINT, (props) => {
  return {
    location: props.location,
    language: props.language,
    since: BIRTH_OF_UNIVERSE
  }
}, (props) => {
  return {
    location: props.location
  }
})

export const DisclaimerFetcher = createFetcher(DISCLAIMER_FETCHER, (props) => {
  return {
    location: props.location,
    language: props.language,
    since: BIRTH_OF_UNIVERSE
  }
}, (props) => {
  return {
    location: props.location
  }
})

export const LanguageFetcher = createFetcher(LANGUAGE_FETCHER, (props) => {
  return {
    location: props.location,
    language: props.language
  }
}, () => { return {} })

export const LocationFetcher = createFetcher(LOCATION_FETCHER, () => { return {} }, () => { return {} })
