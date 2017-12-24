import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'

import Breadcrumb from 'routes/categories/components/Breadcrumb'
import PdfButton from 'routes/categories/components/PdfButton'
import withFetcher from 'modules/endpoint/hocs/withFetcher'
import CATEGORIES_ENDPOINT from 'modules/endpoint/endpoints/categories'
import LANGUAGES_ENDPOINT from 'modules/endpoint/endpoints/languages'
import LOCATION_ENDPOINT from 'modules/endpoint/endpoints/location'

import CategoryModel from 'modules/endpoint/models/CategoryModel'
import { setLanguageChangeUrls } from 'modules/language/actions/setLanguageChangeUrls'
import LanguageModel from 'modules/endpoint/models/LanguageModel'
import Page from '../components/Page'
import CategoryTiles from '../components/CategoryTiles'
import TitledContentList from '../components/CategoryList'
import LocationModel from '../../../modules/endpoint/models/LocationModel'
import { replace } from 'redux-little-router'

/**
 * Matching the route /<location>/<language>*
 */
class CategoriesPage extends React.Component {
  static propTypes = {
    location: PropTypes.string.isRequired,
    languages: PropTypes.arrayOf(PropTypes.instanceOf(LanguageModel)).isRequired,
    language: PropTypes.string.isRequired,
    path: PropTypes.string,
    categoryId: PropTypes.string,
    categories: PropTypes.arrayOf(PropTypes.instanceOf(CategoryModel)).isRequired,
    locations: PropTypes.arrayOf(PropTypes.instanceOf(LocationModel)).isRequired
  }

  getBaseUrl () {
    return `/${this.props.location}/${this.props.language}`
  }

  componentDidMount () {
    console.log('id: ' + this.props.categoryId)
    console.log('path' + this.props.path)
    if (this.props.categoryId) {
      this.props.dispatch(replace(this.getRedirectUrl(this.props.categoryId)))
      return
    }
    this.setLanguageChangeUrls(this.props.path)
  }

  getRedirectUrl = (id) => {
    const path = CategoryModel.getCategoryById(this.props.categories, id).url
    const url = `/${this.props.location}/${this.props.language}/${path}`
    console.log(url)
    return url
  }

  // we must not call dispatch in componentWillUpdate or componentDidUpdate
  componentWillReceiveProps (nextProps) {
    if (nextProps.path !== this.props.path) {
      this.setLanguageChangeUrls(nextProps.path)
    }
  }

  mapLanguageToUrl = (language, id) => (
    id ? `/${this.props.location}/${language}?id=${id}` : `/${this.props.location}/${language}`
  )

  /**
   * Gets and stores the available languages for the current page
   * @param {string} path The current path
   */
  setLanguageChangeUrls (path) {
    this.props.dispatch(setLanguageChangeUrls(
      this.mapLanguageToUrl, this.props.languages, CategoryModel.getCategoryByPath(this.props.categories, path).availableLanguages)
    )
  }

  getPdfFetchPath () {
    let path = `/${this.props.location}/${this.props.language}/fetch-pdf/`
    if (this.props.path) {
      path += this.props.path
    }
    return path
  }

  render () {
    const baseUrl = this.getBaseUrl()
    const category = CategoryModel.getCategoryByPath(this.props.categories, this.props.path)
    const children = this.props.categories.filter(_category => category.children.includes(_category.id))

    let Content
    if (category.children.length === 0) {
      Content = <Page page={category} />
    } else if (category.id === 0) {
      Content = <CategoryTiles categories={children}
                               baseUrl={baseUrl}
                               title={category.title}
                               locations={this.props.locations} />
    } else {
      Content = <TitledContentList categories={children}
                                   baseUrl={baseUrl}
                                   parentCategory={category} />
    }

    return <div>
      <Breadcrumb
        categories={this.props.categories}
        category={category}
        locations={this.props.locations}
        baseUrl={baseUrl} />
      {Content}
      <PdfButton href={this.getPdfFetchPath()} />
    </div>
  }
}

const mapStateToProps = (state) => ({
  language: state.router.params.language,
  location: state.router.params.location,
  path: state.router.params['_'], // _ contains all the values from *
  categoryId: state.router.query.id
})

export default compose(
  connect(mapStateToProps),
  withFetcher(CATEGORIES_ENDPOINT),
  withFetcher(LANGUAGES_ENDPOINT),
  withFetcher(LOCATION_ENDPOINT)
)(CategoriesPage)
