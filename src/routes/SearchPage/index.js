import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Layout from 'components/Layout'
import LANGUAGE_ENDPOINT from 'endpoints/language'
import Payload from 'endpoints/Payload'
import ContentList from 'components/Content/ContentList'
import PageModel from 'endpoints/models/PageModel'
import PAGE_ENDPOINT from 'endpoints/page'
import { forEach } from 'lodash/collection'

const BIRTH_OF_UNIVERSE = new Date(0).toISOString().split('.')[0] + 'Z'

class SearchPage extends React.Component {
  static propTypes = {
    language: PropTypes.string.isRequired,
    pagePayload: PropTypes.instanceOf(Payload).isRequired
  }

  componentWillUnmount () {
    this.props.dispatch(LANGUAGE_ENDPOINT.invalidateAction())
  }

  componentWillMount () {
    let location = this.getLocation()
    let languageCode = this.props.language
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

  getLocation () {
    return this.props.match.params.location
  }

  flattenPages () {
    let pages = {}
    let page = this.props.pagePayload.data
    if (!page) {
      return
    }
    this._flattenPages(pages, page)
    return pages
  }

  _flattenPages (pages, page) {
    forEach(page.children, page => {
      pages[page.id] = page
      this._flattenPages(pages, page)
    })
  }

  render () {
    return (
      <Layout currentLanguage={this.props.language}>
        <ContentList page={new PageModel(0, '', 0, '', null, this.flattenPages())} url={ this.props.match.url.replace('/search', '') }/>
      </Layout>
    )
  }
}

/**
 * @param state The current app state
 * @return {{locations: {}}}  The endpoint values from the state mapped to props
 */
function mapStateToProps (state) {
  return ({
    language: state.language.language,
    pagePayload: state.pages
  })
}

export default connect(mapStateToProps)(SearchPage)
