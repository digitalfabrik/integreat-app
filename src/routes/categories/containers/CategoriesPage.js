// @flow

import React from 'react'
import { connect } from 'react-redux'

import CategoriesMapModel from 'modules/endpoint/models/CategoriesMapModel'
import Failure from 'modules/common/components/Failure'
import Page from 'modules/common/components/Page'

import Breadcrumbs from 'routes/categories/components/Breadcrumbs'
import PdfButton from 'routes/categories/components/PdfButton'
import Tiles from '../../../modules/common/components/Tiles'
import CategoryList from '../components/CategoryList'
import TileModel from '../../../modules/common/models/TileModel'
import CategoryModel from '../../../modules/endpoint/models/CategoryModel'
import CityModel from '../../../modules/endpoint/models/CityModel'

type Props = {
  categories: CategoriesMapModel,
  cities: Array<CityModel>,
  city: string,
  language: string,
  categoryPath: string
}

/**
 * Displays a CategoryTable, CategoryList or a single category as page matching the route /<city>/<language>*
 */
export class CategoriesPage extends React.Component<Props> {
  getPdfFetchPath () {
    return `/${this.props.city}/${this.props.language}/fetch-pdf${this.props.categoryPath}`
  }

  /**
   * Our root categories don't have the right title (citiy code instead of city title), so we have to compare the
   * title of the root category with the code of every city
   * @param {String} title The title of the category to search for
   * @return {String} The found name or the given title
   */
  getCityName (title: string) {
    const city = this.props.cities.find(_city => title === _city.code)
    return city ? city.name : title
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
    const categories = this.props.categories
    const children = categories.getChildren(category)

    if (children.length === 0) {
      // last level, our category is a simple page
      return <Page title={category.title}
                   content={category.content} />
    } else if (category.id === 0) {
      // first level, we want to display a table with all first order categories
      return <Tiles tiles={this.getTileModels(children)}
                    title={this.getCityName(category.title)} />
    }
    // some level between, we want to display a list
    return <CategoryList categories={children.map(model => ({model, children: categories.getChildren(model)}))}
                         title={category.title}
                         content={category.content} />
  }

  render () {
    const categoryModel = this.props.categories.getCategoryByUrl(this.props.categoryPath)

    if (!categoryModel) {
      return <Failure error='not-found:page.notFound' />
    }

    return <div>
      <Breadcrumbs
        parents={this.props.categories.getAncestors(categoryModel)}
        locationName={this.getCityName(this.props.city)} />
      {this.getContent(categoryModel)}
      <PdfButton href={this.getPdfFetchPath()} />
    </div>
  }
}

const mapStateToProps = state => ({
  language: state.location.payload.language,
  city: state.location.payload.city,
  categoryPath: state.location.pathname,
  categories: state.categories,
  cities: state.cities,
  languages: state.languages
})

export default connect(mapStateToProps)(CategoriesPage)
