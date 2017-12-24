import React from 'react'
import PropTypes from 'prop-types'
import Spinner from 'react-spinkit'
import { replace } from 'redux-little-router'
import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'

import CategoryModel from 'modules/endpoint/models/CategoryModel'
import withFetcher from 'modules/endpoint/hocs/withFetcher'
import CATEGORIES_ENDPOINT from 'modules/endpoint/endpoints/categories'

/**
 * Component to handle redirecting to the page which id is given as a query parameter
 */
class PageRedirectorPage extends React.Component {
  static propTypes = {
    categoryId: PropTypes.string.isRequired,
    categories: PropTypes.arrayOf(PropTypes.instanceOf(CategoryModel)).isRequired,
    language: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired
  }

  /**
   * Redirect to the new Page
   */
  componentDidMount () {
    this.props.dispatch(replace(this.getUrl()))
  }

  /**
   * Build the url of the page with the pageId from props
   * @returns {string} url
   */
  getUrl () {
    const path = CategoryModel.getCategoryById(this.props.categories, this.props.categoryId).url
    return `/${this.props.location}/${this.props.language}/${path}`
  }

  render () {
    return <Spinner name='line-scale-party' />
  }
}

const mapStateToProps = (state) => ({
  categoryId: state.router.query.id,
  location: state.router.params.location,
  language: state.router.params.language
})

export default compose(
  connect(mapStateToProps),
  withFetcher(CATEGORIES_ENDPOINT)
)(PageRedirectorPage)
