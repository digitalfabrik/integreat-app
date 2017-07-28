import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Layout from 'components/Layout'
import Content from 'components/Content'

import PAGE_ENDPOINT from 'endpoints/page'

import LANGUAGE_ENDPOINT from 'endpoints/language'
import Breadcrumb from 'components/Content/Breadcrumb'

import { history } from 'main'

import Payload from 'endpoints/Payload'

import style from './style.css'
import Hierarchy from './Hierarchy'

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
    return '/location/' + this.getLocation()
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
      <Layout languageCallback={this.changeLanguage}
              currentLanguage={this.props.language}>

        { /* Breadcrumb */ }
        <Breadcrumb
          className={style.breadcrumbSpacing}
          hierarchy={ hierarchy }
          location={ this.getLocation() }
        />

        { /* Content */ }
        <Content url={ this.getParentPath() }
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
function mapStateToProps (state) {
  return ({
    languagePayload: state.languages,
    pagePayload: state.pages,
    language: state.language.language
  })
}

export default connect(mapStateToProps)(LocationPage)
