// @flow

import React, { Fragment } from 'react'
import Helmet from 'react-helmet'
import type {Node} from 'react'
import { connect } from 'react-redux'

import CategoriesMapModel from 'modules/endpoint/models/CategoriesMapModel'
import Page from 'modules/common/components/Page'

import Breadcrumbs from 'modules/common/components/Breadcrumbs'
import Tiles from '../../../modules/common/components/Tiles'
import CategoryList from '../components/CategoryList'
import TileModel from '../../../modules/common/models/TileModel'
import CategoryModel from '../../../modules/endpoint/models/CategoryModel'
import CityModel from '../../../modules/endpoint/models/CityModel'
import Link from 'redux-first-router-link'
import FailureSwitcher from '../../../modules/common/components/FailureSwitcher'
import ContentNotFoundError from '../../../modules/common/errors/ContentNotFoundError'
import type { State, UiDirection } from '../../../flowTypes'
import CategoryTimestamp from '../components/CategoryTimestamp'

type Props = {
  categories: CategoriesMapModel,
  cities: Array<CityModel>,
  path: string,
  city: string,
  language: string,
  uiDirection: UiDirection
}

/**
 * Displays a CategoryTable, CategoryList or a single category as page matching the route /<city>/<language>*
 */
export class CategoriesPage extends React.Component<Props> {
  getTileModels (categories: Array<CategoryModel>) {
    return categories.map(category => new TileModel({
      id: String(category.id), title: category.title, path: category.url, thumbnail: category.thumbnail, isExternalUrl: false
    }))
  }

  /**
   * Returns the content to be displayed, based on the current category, which is
   * a) page with information
   * b) table with categories
   * c) list with categories
   * @param category The current category
   * @return {*} The content to be displayed
   */
  getContent (category: CategoryModel) {
    const {categories, cities, language} = this.props
    const children = categories.getChildren(category)

    if (children.length === 0) {
      // last level, our category is a simple page
      return <Fragment>
        <Page title={category.title}
              content={category.content} />
        <CategoryTimestamp category={category} language={language} />
      </Fragment>
    } else if (category.id === 0) {
      // first level, we want to display a table with all first order categories
      return <Tiles tiles={this.getTileModels(children)}
                    title={CityModel.findCityName(cities, category.title)} />
    }
    // some level between, we want to display a list
    return <CategoryList categories={children.map(model => ({model, children: categories.getChildren(model)}))}
                         title={category.title}
                         content={category.content} />
  }

  getBreadcrumbs (categoryModel: CategoryModel): Array<Node> {
    const {cities, categories} = this.props
    return categories.getAncestors(categoryModel)
      .map(ancestor => ({
        title: ancestor.id === 0 ? CityModel.findCityName(cities, ancestor.title) : ancestor.title,
        url: ancestor.url
      }))
      .map(({title, url}) => <Link to={url} key={url}>{title}</Link>)
  }

  render () {
    const {categories, path, city, cities, language, uiDirection} = this.props
    const categoryModel = categories.findCategoryByUrl(path)
    const cityName = CityModel.findCityName(cities, city)

    if (categoryModel) {
      return <div>
        <Helmet>
          <title>{categoryModel.id !== 0 ? `${categoryModel.title} - ` : ''}{cityName}</title>
        </Helmet>
        <Breadcrumbs direction={uiDirection}>
          {this.getBreadcrumbs(categoryModel)}
        </Breadcrumbs>
        {this.getContent(categoryModel)}
      </div>
    }

    const error = new ContentNotFoundError({type: 'category', id: this.props.path, city: city, language})
    return <FailureSwitcher error={error} />
  }
}

const mapStateToProps = (state: State) => ({
  uiDirection: state.uiDirection,
  language: state.location.payload.language,
  city: state.location.payload.city,
  path: state.location.pathname,
  categories: state.categories.data,
  cities: state.cities.data
})

export default connect(mapStateToProps)(CategoriesPage)
