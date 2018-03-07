// @flow

import React from 'react'
import { replace } from 'redux-little-router'
import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'

import withFetcher from 'modules/endpoint/hocs/withFetcher'
import CategoriesMapModel from 'modules/endpoint/models/CategoriesMapModel'
import LanguageModel from 'modules/endpoint/models/LanguageModel'
import LocationModel from 'modules/endpoint/models/LocationModel'
import setLanguageChangeUrls from 'modules/language/actions/setLanguageChangeUrls'
import Failure from 'modules/common/components/Failure'
import Page from 'modules/common/components/Page'

import Breadcrumbs from 'routes/categories/components/Breadcrumbs'
import PdfButton from 'routes/categories/components/PdfButton'
import CategoryTiles from '../components/CategoryTiles'
import CategoryList from '../components/CategoryList'
import LanguageFailure from './LanguageFailure'

import type { CategoryType } from '../../../modules/endpoint/models/CategoryModel'

type mapLanguageToPath = (string, ?string) => string

type Props = {
  categories: CategoriesMapModel,
  locations: Array<LocationModel>,
  languages: Array<LanguageModel>,
  location: string,
  language: string,
  path: string,
  categoryId?: number,
  setLanguageChangeUrls: (mapLanguageToPath, Array<LanguageModel>, ?Object) => void,
  replaceUrl: (string) => void
}

/**
 * Displays a CategoryTable, CategoryList or a single category as page matching the route /<location>/<language>*
 */
export class CategoriesPage extends React.Component<Props> {
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
  componentWillReceiveProps (nextProps: Object) {
    if (nextProps.path !== this.props.path || nextProps.categories !== this.props.categories) {
      const category = nextProps.categories.getCategoryByUrl(nextProps.path)
      this.setLanguageChangeUrls(category)
    }
  }

  /**
   * The function used to map different languages to their CategoriesPage
   * @param {string} language The language
   * @param {string | undefined} id The id of a category
   * @returns {string} The path of the CategoriesPage of a different language
   */
  mapLanguageToPath = (language: string, id: ?string) => (
    id ? `/${this.props.location}/${language}?id=${id}` : `/${this.props.location}/${language}`
  )

  /**
   * Gets and stores the available languages for the current page
   * @param {CategoryType | undefined} category The current category
   */
  setLanguageChangeUrls (category: ?CategoryType) {
    if (category) {
      this.props.setLanguageChangeUrls(
        this.mapLanguageToPath, this.props.languages, category.availableLanguages
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
  getContent (category: CategoryType) {
    const {categories, locations} = this.props
    const children = categories.getChildren(category)

    if (children.length === 0) {
      // last level, our category is a simple page
      return <Page title={category.title}
                   content={category.content} />
    } else if (category.id === 0) {
      // first level, we want to display a table with all first order categories
      return <CategoryTiles categories={children}
                            title={category.title}
                            locations={locations} />
    }
    // some level between, we want to display a list
    return <CategoryList categories={children.map(model => ({model, children: categories.getChildren(model)}))}
                         title={category.title}
                         content={category.content} />
  }

  render () {
    const category = this.props.categories.getCategoryByUrl(this.props.path)

    if (!category) {
      return <Failure error='not-found:page.notFound' />
    }
    this.props.categories.getAncestors(category)

    return <div>
      <Breadcrumbs
        parents={this.props.categories.getAncestors(category)}
        locations={this.props.locations} />
      {this.getContent(category)}
      <PdfButton href={this.getPdfFetchPath()} />
    </div>
  }
}

const mapDispatchToProps = dispatch => ({
  setLanguageChangeUrls: (mapLanguageToPath, languages, availableLanguages) =>
    dispatch(setLanguageChangeUrls(mapLanguageToPath, languages, availableLanguages)),
  replaceUrl: url => dispatch(replace(url))
})

const mapStateToProps = state => ({
  language: state.router.params.language,
  location: state.router.params.location,
  path: state.router.pathname,
  categoryId: Number(state.router.query.id)
})

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withFetcher('categories', LanguageFailure),
  withFetcher('languages'),
  withFetcher('locations')
)(CategoriesPage)
