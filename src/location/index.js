import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { isEmpty } from 'lodash/lang'

import Layout from '../../components/Layout'
import Content from '../../components/Content/Content'

import { fetchEndpoint } from '../endpoints/endpoint'
import PAGE_ENDPOINT, { PageModel } from '../endpoints/page'
import LANGUAGE_ENDPOINT from '../endpoints/language'

class LocationPage extends React.Component {
  static propTypes = {
    languages: PropTypes.array.isRequired,
    page: PropTypes.instanceOf(PageModel).isRequired,
    path: PropTypes.arrayOf(PropTypes.string),
    dispatch: PropTypes.func.isRequired
  }

  componentWillUnmount () {
    // todo only do this if necessary
    this.props.dispatch(LANGUAGE_ENDPOINT.invalidateAction())
    this.props.dispatch(PAGE_ENDPOINT.invalidateAction())
  }

  componentWillMount () {
    // todo make location and language dynamic
    this.props.dispatch(fetchEndpoint(LANGUAGE_ENDPOINT, url => url.replace('{location}', 'augsburg').replace('{language}', 'en')))
    this.props.dispatch(fetchEndpoint(PAGE_ENDPOINT, url => url
      .replace('{location}', this.props.match.params.location)
      .replace('{language}', 'en')
      .replace('{since}', new Date(0).toISOString().split('.')[0] + 'Z')))
  }

  /**
   * Finds the current page which should be rendered based on {@link this.path}
   * @return {PageModel} The model to renders
   */
  page () {
    let currentPage = this.props.page

    // fixme if empty page
    if (currentPage.title === '') {
      return currentPage
    }

    this.props.path.forEach(id => {
      currentPage = currentPage.children[id]

      if (!currentPage) {
        throw new Error('Page not found!')
      }
    })

    return currentPage
  }

  static normalizeURL (url) {
    if (url.endsWith('/')) {
      return url.substr(0, url.length - 1)
    }

    return url
  }

  render () {
    let url = LocationPage.normalizeURL(this.props.match.url)
    let isRoot = isEmpty(this.props.path)
    return (
      <Layout languageTo='/'>
        <Content title={'Augsburg'} url={ url } root={ isRoot } page={this.page()}/>
      </Layout>
    )
  }
}

/**
 * @param state The current app state
 * @return {{languages: Array, page: PageModel}} The endpoint values from the state mapped to props
 */
function mapeStateToProps (state) {
  let languages = state.languages.data
  let pages = state.pages.data
  return ({
    languages: languages || [],
    page: pages || new PageModel()
  })
}

export default connect(mapeStateToProps)(LocationPage)

