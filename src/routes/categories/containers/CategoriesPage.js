// @flow

import * as React from 'react'
import { connect } from 'react-redux'

import { CategoriesMapModel, CategoryModel, CityModel } from '@integreat-app/integreat-api-client'

import Breadcrumbs from '../../../modules/common/components/Breadcrumbs'
import Tiles from '../../../modules/common/components/Tiles'
import CategoryList from '../components/CategoryList'
import TileModel from '../../../modules/common/models/TileModel'
import Link from 'redux-first-router-link'
import FailureSwitcher from '../../../modules/common/components/FailureSwitcher'
import ContentNotFoundError from '../../../modules/common/errors/ContentNotFoundError'
import type { StateType } from '../../../modules/app/StateType'
import type { UiDirectionType } from '../../../modules/i18n/types/UiDirectionType'
import Page from '../../../modules/common/components/Page'
import { push } from 'redux-first-router'

type PropsType = {|
  categories: CategoriesMapModel,
  cities: Array<CityModel>,
  path: string,
  city: string,
  language: string,
  uiDirection: UiDirectionType
|}

/**
 * Displays a CategoryTable, CategoryList or a single category as page matching the route /<city>/<language>*
 */
export class CategoriesPage extends React.Component<PropsType> {
  getTileModels (categories: Array<CategoryModel>): Array<TileModel> {
    return categories.map(category => new TileModel({
      id: String(category.id),
      title: category.title,
      path: category.path,
      thumbnail: category.thumbnail,
      isExternalUrl: false,
      postData: null
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
  getContent (category: CategoryModel): React.Node {
    const {categories, cities, language} = this.props
    const children = categories.getChildren(category)
    if (category.isLeaf(categories)) {
      // last level, our category is a simple page
      return <Page title={category.title}
                   content={category.content}
                   lastUpdate={category.lastUpdate}
                   language={language}
                   onInternalLinkClick={push} />
    } else if (category.isRoot()) {
      // first level, we want to display a table with all first order categories
      return <Tiles tiles={this.getTileModels(children)}
                    title={CityModel.findCityName(cities, category.title)} />
    }
    // some level between, we want to display a list
    return <CategoryList categories={children.map(model => ({model, subCategories: categories.getChildren(model)}))}
                         title={category.title}
                         content={category.content}
                         thumbnail={category.thumbnail}
                         onInternalLinkClick={push} />
  }

  getBreadcrumbs (categoryModel: CategoryModel): Array<React.Node> {
    const {cities, categories} = this.props
    return categories.getAncestors(categoryModel)
      .map(ancestor => {
        const title = ancestor.id === 0 ? CityModel.findCityName(cities, ancestor.title) : ancestor.title
        return <Link to={ancestor.path} key={ancestor.path}>{title}</Link>
      })
  }

  render () {
    const {categories, path, city, language, uiDirection} = this.props
    const categoryModel = categories.findCategoryByPath(path)

    if (categoryModel) {
      return <div>
        <Breadcrumbs direction={uiDirection}>
          {this.getBreadcrumbs(categoryModel)}
        </Breadcrumbs>
        {this.getContent(categoryModel)}
      </div>
    } else {
      const error = new ContentNotFoundError({type: 'category', id: this.props.path, city: city, language})
      return <FailureSwitcher error={error} />
    }
  }
}

const mapStateToProps = (state: StateType) => ({
  uiDirection: state.uiDirection,
  language: state.location.payload.language,
  city: state.location.payload.city,
  path: state.location.pathname
})

export default connect(mapStateToProps)(CategoriesPage)
