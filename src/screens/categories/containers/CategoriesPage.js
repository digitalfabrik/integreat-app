// @flow

import * as React from 'react'

import CategoriesMapModel from 'modules/endpoint/models/CategoriesMapModel'
import Page from 'modules/common/components/Page'

import Tiles from '../../../modules/common/components/Tiles'
import CategoryList from '../components/CategoryList'
import TileModel from '../../../modules/common/models/TileModel'
import CategoryModel from '../../../modules/endpoint/models/CategoryModel'
import CityModel from '../../../modules/endpoint/models/CityModel'
import FailureSwitcher from '../../../modules/common/components/FailureSwitcher'
import ContentNotFoundError from '../../../modules/common/errors/ContentNotFoundError'
import CategoryTimeStamp from '../components/CategoryTimeStamp'
import { translate } from 'react-i18next'

type PropsType = {
  categories: CategoriesMapModel,
  cities: Array<CityModel>,
  path: string,
  city: string,
  language: string
}

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
      isExternalUrl: false
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
      return <React.Fragment>
        <Page title={category.title}
              content={category.content} />
        {category.lastUpdate && <CategoryTimeStamp lastUpdate={category.lastUpdate} language={language} />}
      </React.Fragment>
    } else if (category.isRoot()) {
      // first level, we want to display a table with all first order categories
      return <Tiles tiles={this.getTileModels(children)}
                    title={CityModel.findCityName(cities, category.title)} />
    }
    // some level between, we want to display a list
    return <CategoryList categories={children.map(model => ({model, subCategories: categories.getChildren(model)}))}
                         title={category.title}
                         content={category.content} />
  }

  render () {
    const {categories, path, city, language} = this.props
    const categoryModel = categories.findCategoryByPath(path)

    if (categoryModel) {
      return <>
        {this.getContent(categoryModel)}
      </>
    } else {
      const error = new ContentNotFoundError({type: 'category', id: this.props.path, city: city, language})
      return <FailureSwitcher error={error} />
    }
  }
}

export default translate('categories')(CategoriesPage)
