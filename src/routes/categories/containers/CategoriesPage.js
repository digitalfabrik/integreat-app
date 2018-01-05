import React from 'react'
import PropTypes from 'prop-types'
import { replace } from 'redux-little-router'
import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'

import withFetcher from 'modules/endpoint/hocs/withFetcher'
import CATEGORIES_ENDPOINT from 'modules/endpoint/endpoints/categories'
import LANGUAGES_ENDPOINT from 'modules/endpoint/endpoints/languages'
import LOCATIONS_ENDPOINT from 'modules/endpoint/endpoints/locations'
import CategoriesMapModel from 'modules/endpoint/models/CategoriesMapModel'
import LanguageModel from 'modules/endpoint/models/LanguageModel'
import LocationModel from 'modules/endpoint/models/LocationModel'
import { setLanguageChangeUrls } from 'modules/language/actions/setLanguageChangeUrls'
import Error from 'modules/common/components/Error'
import Page from 'modules/common/components/Page'

import Breadcrumbs from 'routes/categories/components/Breadcrumbs'
import PdfButton from 'routes/categories/components/PdfButton'
import CategoryTiles from '../components/CategoryTiles'
import CategoryList from '../components/CategoryList'

/**
 * Displays a CategoryTable, CategoryList or a single category as page matching the route /<location>/<language>*
 */
export class CategoriesPage extends React.Component {
  static propTypes = {
    categories: PropTypes.instanceOf(CategoriesMapModel).isRequired,
    locations: PropTypes.arrayOf(PropTypes.instanceOf(LocationModel)).isRequired,
    languages: PropTypes.arrayOf(PropTypes.instanceOf(LanguageModel)).isRequired,
    location: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    path: PropTypes.string,
    categoryId: PropTypes.string,
    setLanguageChangeUrls: PropTypes.func.isRequired,
    replaceUrl: PropTypes.func.isRequired
  }

  /**
   * If category is defined, we want to redirect to the page with the given id,
   * else we just dispatch the language change urls here
   */
  componentDidMount () {
    if (this.props.categoryId) {
      const category = this.props.categories.getCategoryById(this.props.categoryId)
      if (category) {
        this.props.replaceUrl(category.url)
      }
    }
    const category = this.props.categories.getCategoryByUrl(this.props.path)
    this.setLanguageChangeUrls(category)
  }

  /**
   * Dispatches the action to set the language change urls after a prop change
   * (selection of a category or update of categories)
   * we must NOT call dispatch in componentWillUpdate or componentDidUpdate
   * @see https://reactjs.org/docs/react-component.html#componentwillupdate
   * @param nextProps The new props
   */
  componentWillReceiveProps (nextProps) {
    if (nextProps.path !== this.props.path || nextProps.categories !== this.props.categories) {
      const category = nextProps.categories.getCategoryByUrl(nextProps.path)
      this.setLanguageChangeUrls(category)
    }
  }

  /**
   * The function used to map different languages to their CategoriesPage
   * @param {string} language The language
   * @param {string | undefined} id The id of a category
   * @returns {string} The url of the CategoriesPage of a different language
   */
  mapLanguageToUrl = (language, id) => (
    id ? `/${this.props.location}/${language}?id=${id}` : `/${this.props.location}/${language}`
  )

  /**
   * Gets and stores the available languages for the current page
   * @param {CategoryModel | undefined} category The current category
   */
  setLanguageChangeUrls (category) {
    if (category) {
      this.props.setLanguageChangeUrls(
        this.mapLanguageToUrl, this.props.languages, category.availableLanguages
      )
    }
  }

  getPdfFetchPath () {
    return `/${this.props.location}/${this.props.language}/fetch-pdf?url=${this.props.path}`
  }

  /**
   * Returns the content to be displayed, based on the current category, which is
   * a) page with information
   * b) table with categories
   * c) list with categories
   * @param category The current category
   * @return {*} The content to be displayed
   */
  getContent (category) {
    const children = this.props.categories.getChildren(category)

    if (children.length === 0) {
      // last level, our category is a simple page
      return <Page title={category.title}
                   content={category.content} />
    } else if (category.id === 0) {
      // first level, we want to display a table with all first order categories
      return <CategoryTiles categories={children}
                            title={category.title}
                            locations={this.props.locations} />
    }
    // some level between, we want to display a list
    return <CategoryList categories={children}
                         title={category.title}
                         content={category.content} />
  }

  render () {
    const category = this.props.categories.getCategoryByUrl(this.props.path)

    if (!category) {
      return <Error error='not-found:page.notFound' />
    }

    return <div>
      <Breadcrumbs
        parents={this.props.categories.getAncestors(category)}
        locations={this.props.locations} />
      {this.getContent(category)}
      <PdfButton href={this.getPdfFetchPath()} />
    </div>
  }
}

const mapDispatchToProps = (dispatch) => ({
  setLanguageChangeUrls: (mapLanguageToUrl, languages, availableLanguages) =>
    dispatch(setLanguageChangeUrls(mapLanguageToUrl, languages, availableLanguages)),
  replaceUrl: (url) => dispatch(replace(url))
})

const mapStateToProps = (state) => ({
  language: state.router.params.language,
  location: state.router.params.location,
  path: state.router.pathname,
  categoryId: state.router.query.id
})

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withFetcher(CATEGORIES_ENDPOINT),
  withFetcher(LANGUAGES_ENDPOINT),
  withFetcher(LOCATIONS_ENDPOINT)
)(CategoriesPage)
