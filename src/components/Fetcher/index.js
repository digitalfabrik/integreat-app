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

function createFetcher (endpoint,
                        createUrlOptions, createUrlTransformOptions,
                        mapStateToProps = () => { return {} },
                        shouldUpdate = () => false) {
  let stateName = endpoint.name
  let payloadName = stateName + 'Payload'

  function mapStateToFetcherProps (state) {
    let props = mapStateToProps(state)

    props[payloadName] = state[stateName]
    return props
  }

  let Fetcher = class extends React.PureComponent {
    static propTypes = {
      hideError: PropTypes.bool
    }

    fetch (props) {
      this.props.dispatch(endpoint.fetchEndpointAction(createUrlOptions(props), createUrlTransformOptions(props)))
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
      if (shouldUpdate(this.props, nextProps)) {  // todo: this will need some more work to test -> an other issue as
        // this is getting too big
        this.fetch(nextProps)
      }
    }

    render () {
      let payload = this.props[payloadName]

      if (!this.props.hideError && payload.error) {
        return <Error error={payload.error}/>
      }

      if (payload.ready()) {
        let newProps = {}
        newProps[stateName] = payload.data
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

  return connect(mapStateToFetcherProps)(Fetcher)
}

// todo: this section contains a lot of duplicate code which can be simplified
// difficult part: find good names :P

const BIRTH_OF_UNIVERSE = new Date(0).toISOString().split('.')[0] + 'Z'

let pagesUrlOptions = (props) => ({
  location: props.location,
  language: props.language,
  since: BIRTH_OF_UNIVERSE
})

let locationTransformOptions = (props) => ({location: props.location})

let noOptions = () => { return {} }

let updateOnLanguageChange = (props, nextProps) => props.language !== nextProps.language

let mapLanguageToProps = (state) => ({language: state.language.language})

export const PageFetcher = createFetcher(PAGE_ENDPOINT,
  pagesUrlOptions, locationTransformOptions,
  mapLanguageToProps,
  updateOnLanguageChange
)

export const DisclaimerFetcher = createFetcher(DISCLAIMER_FETCHER,
  pagesUrlOptions, locationTransformOptions,
  mapLanguageToProps,
  updateOnLanguageChange
)

export const LanguageFetcher = createFetcher(LANGUAGE_FETCHER,
  (props) => {
    return {
      location: props.location,
      language: props.language
    }
  }, noOptions,
  mapLanguageToProps,
  updateOnLanguageChange
)

export const LocationFetcher = createFetcher(LOCATION_FETCHER,
  noOptions, noOptions
)
