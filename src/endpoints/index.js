import LANGUAGE_ENDPOINT from './language'
import LOCATION_ENDPOINT from './location'
import PAGE_ENDPOINT from './page'
import DISCLAIMER_ENDPOINT from './disclaimer'
import createFetcher from './createFetcher'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { find } from 'lodash/collection'
import LocationModel from './models/LocationModel'

export default [
  LANGUAGE_ENDPOINT,
  LOCATION_ENDPOINT,
  PAGE_ENDPOINT,
  DISCLAIMER_ENDPOINT
]

export const DisclaimerFetcher = createFetcher(DISCLAIMER_ENDPOINT)
export const LanguageFetcher = createFetcher(LANGUAGE_ENDPOINT)
export const LocationFetcher = createFetcher(LOCATION_ENDPOINT)
export const PageFetcher = createFetcher(PAGE_ENDPOINT)

const mapStateToProps = (state) => { return { locationCode: state.router.params.location } }
const PageFetcherAdapter = connect(mapStateToProps)(class PageFetcherAdapter extends React.Component {
  static propTypes = {
    locationCode: PropTypes.string.isRequired,
    locations: PropTypes.arrayOf(PropTypes.instanceOf(LocationModel)).isRequired
  }

  render () {
    if (!this.props.locations) {
      throw new Error('Error: why get these lost? :(')
    }
    const locationTitle = find(this.props.locations, (location) => location.code === this.props.locationCode).name
    return <PageEndpointFetcher options={ { locationTitle } }>
      { this.props.children }
    </PageEndpointFetcher>
  }
})

export const AdapterPageFetcher = (props) => {
  return <LocationFetcher><PageFetcher>
    { React.cloneElement(React.Children.only(props.children), Object.assign({}, props)) }
  </PageFetcher></LocationFetcher>
}
