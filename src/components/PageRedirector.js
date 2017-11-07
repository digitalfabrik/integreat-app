import React from 'react'
import PropTypes from 'prop-types'
import { push } from 'redux-little-router'
import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'

import PageModel from '../endpoints/models/PageModel'
import withFetcher from '../endpoints/withFetcher'
import PAGE_ENDPOINT from 'endpoints/page'

/**
 * Component to handle redirecting to the page which id is given as a query parameter
 */
class PageRedirector extends React.Component {
  static propTypes = {
    pageId: PropTypes.string.isRequired,
    pages: PropTypes.instanceOf(PageModel).isRequired,
    language: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired
  }

  constructor (props) {
    super(props)

    this.getUrl = this.getUrl.bind(this)
  }

  componentDidMount () {
    this.props.dispatch(push(this.getUrl()))
  }

  /**
   * Search recursively for the page with pageId from props
   * @param page root page with all pages as children
   * @param path array to put the ids
   * @returns {*} the path of the found page as array
   */
  findPage (page, path) {
    if (page.id !== 'rootId') path.push(page.id)
    if (page.numericId.toString() === this.props.pageId) {
      return path
    } else if (page.children) {
      for (let i = 0; i < page.children.length; i++) {
        let result = this.findPage(page.children[i], path)
        if (result !== null) return result
      }
      path.pop(page.id)
      return null
    }
    path.pop(page.id)
    return null
  }

  /**
   * Build the url of the page with the pageId from props
   * @returns {string} url
   */
  getUrl () {
    let url = []
    url = this.findPage(this.props.pages, url)
    return `/${this.props.location}/${this.props.language}/${url.join('/')}/`
  }

  render () {
    return (
      <div>
        {'redirecting'}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({pageId: state.router.query.id, location: state.router.params.location, language: state.router.params.language})

export default compose(connect(mapStateToProps), withFetcher(PAGE_ENDPOINT))(PageRedirector)
