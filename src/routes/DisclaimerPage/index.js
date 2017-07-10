import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Layout from 'components/Layout'

import LANGUAGE_ENDPOINT from 'endpoints/language'
import DISCLAIMER_ENDPOINT from 'endpoints/disclaimer'
import Payload from '../../endpoints/Payload'
import Page from '../../components/Content/Page'

const BIRTH_OF_UNIVERSE = new Date(0).toISOString().split('.')[0] + 'Z'

class DisclaimerPage extends React.Component {
  static propTypes = {
    language: PropTypes.string.isRequired,
    languagePayload: PropTypes.instanceOf(Payload).isRequired,
    disclaimerPayload: PropTypes.instanceOf(Payload).isRequired
  }

  constructor (props) {
    super(props)
    this.changeLanguage = this.changeLanguage.bind(this)
  }

  changeLanguage (language) {
    // Invalidate
    this.props.dispatch(LANGUAGE_ENDPOINT.invalidateAction())
    this.props.dispatch(DISCLAIMER_ENDPOINT.invalidateAction())

    // Re-fetch
    this.fetchData(language)
  }

  componentWillUnmount () {
    this.props.dispatch(LANGUAGE_ENDPOINT.invalidateAction())
    this.props.dispatch(DISCLAIMER_ENDPOINT.invalidateAction())
  }

  componentWillMount () {
    this.fetchData(this.props.language)
  }

  fetchData (language) {
    let location = this.getLocation()
    this.props.dispatch(LANGUAGE_ENDPOINT.fetchEndpointAction({
      location: location,
      language: language
    }))
    this.props.dispatch(DISCLAIMER_ENDPOINT.fetchEndpointAction({
      location: location,
      language: language,
      since: BIRTH_OF_UNIVERSE
    }, {Location: location}))
  }

  getLocation () {
    return this.props.match.params.location
  }

  render () {
    return (
      <Layout languageCallback={this.changeLanguage}
              currentLanguage={this.props.language}>
        { this.props.disclaimerPayload.data !== null ? <Page page={this.props.disclaimerPayload.data}/> : null }
      </Layout>
    )
  }
}

/**
 * @param state The current app state
 * @return {{languagePayload: *, disclaimerPayload: *, language}}  The endpoint values from the state mapped to props
 */
function mapStateToProps (state) {
  return {
    languagePayload: state.languages,
    disclaimerPayload: state.disclaimer,
    language: state.language.language
  }
}

export default connect(mapStateToProps)(DisclaimerPage)
