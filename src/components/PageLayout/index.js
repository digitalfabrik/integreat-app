import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Layout from 'components/Layout'

import PAGE_ENDPOINT from 'endpoints/page'

import LANGUAGE_ENDPOINT from 'endpoints/language'

import { history } from 'main'

import Payload from 'endpoints/Payload'

const BIRTH_OF_UNIVERSE = new Date(0).toISOString().split('.')[0] + 'Z'

class PageLayout extends React.Component {
  static propTypes = {
    languagePayload: PropTypes.instanceOf(Payload).isRequired,
    location: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)

    this.changeLanguage = this.changeLanguage.bind(this)
  }

  componentDidUpdate () {
// eslint-disable-next-line
    window.scrollTo(0, 0)
  }

  componentWillUnmount () {
    // todo only do this if necessary
    this.props.dispatch(LANGUAGE_ENDPOINT.invalidateAction())
    this.props.dispatch(PAGE_ENDPOINT.invalidateAction())
  }

  componentWillMount () {
    this.fetchData(this.props.language)
  }

  fetchData (languageCode) {
    let location = this.props.location
    if (!location) {
      // Don't fetch language options if we have an invalid URL for example
      return
    }
    this.props.dispatch(LANGUAGE_ENDPOINT.fetchEndpointAction({
      location: location,
      language: languageCode
    }))
    this.props.dispatch(PAGE_ENDPOINT.fetchEndpointAction({
      location: location,
      language: languageCode,
      since: BIRTH_OF_UNIVERSE
    }, {location: location}))
  }

  changeLanguage (code) {
    // Invalidate
    this.props.dispatch(PAGE_ENDPOINT.invalidateAction())
    // Go to back to parent page
    history.push(this.getParentPath())
    // Re-fetch
    this.fetchData(code)
  }

  getParentPath () {
    return '/location/' + this.props.location
  }

  render () {
    return (<div>
        {this.props.languagePayload.data &&
          <Layout className={this.props.className}
                  languages={this.props.languagePayload.data}
                  languageCallback={this.changeLanguage}
                  currentLanguage={this.props.language}>
            <div>{this.props.children}</div>
          </Layout>
        }
      </div>
    )
  }
}
/**
 * @param state The current app state
 * @returns {{languagePayload: Payload, language: string}} The endpoint values from the state mapped to props
 */
function mapStateToProps (state) {
  return ({
    languagePayload: state.languages,
    language: state.language.language
  })
}

export default connect(mapStateToProps)(PageLayout)
