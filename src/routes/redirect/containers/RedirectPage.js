import React from 'react'
import PropTypes from 'prop-types'
import Spinner from 'react-spinkit'
import { replace } from 'redux-little-router'
import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'
import { forEach } from 'lodash/collection'

import PageModel from 'modules/endpoint/models/PageModel'
import withFetcher from 'modules/endpoint/hocs/withFetcher'
import PAGE_ENDPOINT from 'modules/endpoint/endpoints/pages'

/**
 * Component to handle redirecting to the page which id is given as a query parameter
 */
class PageRedirectorPage extends React.Component {
  static propTypes = {
    pageId: PropTypes.string.isRequired,
    pages: PropTypes.instanceOf(PageModel).isRequired,
    language: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired
  }

  /**
   * Redirect to the new Page
   */
  componentDidMount () {
    this.props.dispatch(replace(this.getUrl()))
  }

  acceptPage (page) {
    return page.numericId.toString() === this.props.pageId
  }

  /**
   * Search recursively for the page with the pageId in props
   * @param baseUrl the baseUrl to append to
   * @param page the page to start the search with
   * @param out an object containing the full url
   * @returns {boolean} to break the forEach
   */
  findPage (baseUrl, page, out) {
    let url = baseUrl
    if (page.id !== 'rootId') {
      url += '/' + page.id
    }
    if (this.acceptPage(page)) {
      out.url = url
      return false
    }
    forEach(page.children, page => this.findPage(url, page, out))
  }

  /**
   * Build the url of the page with the pageId from props
   * @returns {string} url
   */
  getUrl () {
    const out = {}
    this.findPage('', this.props.pages, out)
    return `/${this.props.location}/${this.props.language}${out.url || ''}`
  }

  render () {
    return <Spinner name='line-scale-party'/>
  }
}

const mapStateToProps = (state) => ({
  pageId: state.router.query.id,
  location: state.router.params.location,
  language: state.router.params.language
})

export default compose(
  connect(mapStateToProps),
  withFetcher(PAGE_ENDPOINT)
)(PageRedirectorPage)
