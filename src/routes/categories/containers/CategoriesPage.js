// @flow

import React from 'react'
import { connect } from 'react-redux'

import CategoriesMapModel from 'modules/endpoint/models/CategoriesMapModel'
import Page from 'modules/common/components/Page'

import Breadcrumbs from 'routes/categories/components/Breadcrumbs'
import PdfButton from 'routes/categories/components/PdfButton'
import Tiles from '../../../modules/common/components/Tiles'
import CategoryList from '../components/CategoryList'
import TileModel from '../../../modules/common/models/TileModel'
import CategoryModel from '../../../modules/endpoint/models/CategoryModel'
import CityModel from '../../../modules/endpoint/models/CityModel'
import { apiUrl } from '../../../modules/endpoint/constants'
import { FailureSwitcher } from '../../../modules/common/containers/FailureSwitcher'
import NotFoundError from '../errors/NotFoundError'

type Props = {
  categories: CategoriesMapModel,
  cities: Array<CityModel>,
  city: string,
  language: string,
  path: string
}

/**
 * Displays a CategoryTable, CategoryList or a single category as page matching the route /<city>/<language>*
 */
export class CategoriesPage extends React.Component<Props> {
  getPdfUrl (category: CategoryModel) {
    if (category.id === 0) {
      return `${apiUrl}/${this.props.city}/${this.props.language}/wp-json/ig-mpdf/v1/pdf`
    } else {
      return `${apiUrl}/${this.props.city}/${this.props.language}/wp-json/ig-mpdf/v1/pdf?url=${this.props.path}`
    }
  }

  getTileModels (categories: Array<CategoryModel>) {
    return categories.map(category => new TileModel({
      id: category.id, name: category.title, path: category.url, thumbnail: category.thumbnail
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
    const {categories, cities} = this.props
    const children = categories.getChildren(category)

    if (children.length === 0) {
      // last level, our category is a simple page
      return <Page title={category.title}
                   content={category.content} />
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

  render () {
    const {categories, path, city, cities} = this.props
    const categoryModel = categories.findCategoryByUrl(path)
    const cityName = CityModel.findCityName(cities, city)

    if (categoryModel) {
      return <div>
          <Breadcrumbs
            parents={categories.getAncestors(categoryModel)}
            cityName={cityName} />
          {this.getContent(categoryModel)}
          <PdfButton href={this.getPdfUrl(categoryModel)} />
        </div>
    }

    const error = new NotFoundError({type: 'category', id: this.props.path, city: cityName})
    return <FailureSwitcher error={error} />
  }
}

const mapStateToProps = state => ({
  language: state.location.payload.language,
  city: state.location.payload.city,
  path: state.location.pathname,
  categories: state.categories.data,
  cities: state.cities.data
})

export default connect(mapStateToProps)(CategoriesPage)
