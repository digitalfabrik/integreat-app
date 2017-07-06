import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Layout from 'components/Layout/Layout'
import Content from 'components/Content/Content'

import { fetchEndpoint } from 'endpoints/endpoint'
import PAGE_ENDPOINT from 'endpoints/page'

import LANGUAGE_ENDPOINT from 'endpoints/language'

import NAVIGATION from 'navigation'
import Breadcrumb from 'components/Content/Breadcrumb'

import { history } from 'main'

import Payload from 'payload'

import style from './styles.css'
import Hierarchy from './hierarchy'
import { setLanguage } from '../actions'

const BIRTH_OF_UNIVERSE = new Date(0).toISOString().split('.')[0] + 'Z'

class LocationPage extends React.Component {
  static propTypes = {
    pagePayload: PropTypes.instanceOf(Payload).isRequired,
    languagePayload: PropTypes.instanceOf(Payload).isRequired,
    language: PropTypes.string.isRequired,
    hierarchy: PropTypes.instanceOf(Hierarchy).isRequired,
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
    let location = this.getLocation()
    this.props.dispatch(fetchEndpoint(LANGUAGE_ENDPOINT, url => url
      .replace('{location}', location)
      .replace('{language}', languageCode)))
    this.props.dispatch(fetchEndpoint(PAGE_ENDPOINT, url => url
      .replace('{location}', location)
      .replace('{language}', languageCode)
      .replace('{since}', BIRTH_OF_UNIVERSE), {location: location}))
  }

  changeLanguage (code) {
    // Set new language through redux
    this.props.dispatch(setLanguage(code))
    // Go to back to parent page
    history.push('/location/' + this.getLocation())
    // Invalidate
    this.props.dispatch(PAGE_ENDPOINT.invalidateAction())
    // Re-fetch
    this.fetchData(code)
  }

  getLocation () {
    return this.props.match.params.location
  }

  render () {
    let hierarchy = this.props.hierarchy
    let payload = this.props.pagePayload

    // Pass data to hierarchy
    hierarchy = hierarchy.build(payload.data)
    if (payload.error) {
      hierarchy = hierarchy.error(payload.error)
    }

    return (
      <Layout
        languageCallback={this.changeLanguage}
        languagePayload={this.props.languagePayload}
        navigation={NAVIGATION}
        currentLanguage={this.props.language}>

        { /* Breadcrumb */ }
        <Breadcrumb
          className={style.breadcrumbSpacing}
          hierarchy={ hierarchy }
          location={ this.getLocation() }
        />

        { /* Content */ }
        <Content url={ this.props.match.url }
                 hierarchy={ hierarchy }
        />
      </Layout>
    )
  }
}
/**
 * @param state The current app state
 * @returns {{languagePayload: Payload, pagePayload: Payload, language: string}} The endpoint values from the state mapped to props
 */
function mapeStateToProps (state) {
  return ({
    languagePayload: state.languages,
    pagePayload: state.pages,
    language: state.language.language
  })
}

export default connect(mapeStateToProps)(LocationPage)
