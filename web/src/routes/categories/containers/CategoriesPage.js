// @flow

import * as React from 'react'
import { connect } from 'react-redux'
import { CategoriesMapModel, CategoryModel, CityModel, NotFoundError } from 'api-client'
import Breadcrumbs from '../../../modules/common/components/Breadcrumbs'
import Tiles from '../../../modules/common/components/Tiles'
import CategoryList from '../components/CategoryList'
import TileModel from '../../../modules/common/models/TileModel'
import Link from 'redux-first-router-link'
import FailureSwitcher from '../../../modules/common/components/FailureSwitcher'
import type { StateType } from '../../../modules/app/StateType'
import type { UiDirectionType } from '../../../modules/i18n/types/UiDirectionType'
import Page from '../../../modules/common/components/Page'
import { push } from 'redux-first-router'
import BreadcrumbModel from '../../../modules/common/BreadcrumbModel'
import urlFromPath from '../../../modules/common/utils/urlFromPath'
import { withTranslation } from 'react-i18next'
import { TFunction } from 'i18next'
import DateFormatter from 'api-client/src/i18n/DateFormatter'
import { useContext } from 'react'
import DateFormatterContext from '../../../modules/i18n/context/DateFormatterContext'

const getTileModels = (categories: Array<CategoryModel>): Array<TileModel> => {
  return categories.map(category => new TileModel({
    title: category.title,
    path: category.path,
    thumbnail: category.thumbnail,
    isExternalUrl: false,
    postData: null
  }))
}

type CategoriesContentPropsType = {|
  categories: CategoriesMapModel,
  categoryModel: CategoryModel,
  t: TFunction,
  formatter: DateFormatter
|}

/**
 * Returns the content to be displayed, based on the current category, which is
 * a) page with information
 * b) table with categories
 * c) list with categories
 */
const CategoriesContent = ({
  categories,
  categoryModel,
  formatter,
  t
}: CategoriesContentPropsType) => {
  const children = categories.getChildren(categoryModel)
  if (categoryModel.isLeaf(categories)) {
    // last level, our category is a simple page
    return <Page title={categoryModel.title}
                 content={categoryModel.content}
                 lastUpdate={categoryModel.lastUpdate}
                 formatter={formatter}
                 onInternalLinkClick={push} />
  } else if (categoryModel.isRoot()) {
    // first level, we want to display a table with all first order categories
    return <Tiles tiles={getTileModels(children)}
                  title={t('localInformation')} />
  }
  // some level between, we want to display a list
  return <CategoryList
    categories={children.map(model => ({
      model,
      subCategories: categories.getChildren(model)
    }))}
    title={categoryModel.title}
    content={categoryModel.content}
    thumbnail={categoryModel.thumbnail}
    onInternalLinkClick={push} />
}

type BreadcrumbsPropsType = {|
  categories: CategoriesMapModel,
  cities: Array<CityModel>,
  categoryModel: CategoryModel,
  city: string,
  uiDirection: UiDirectionType
|}

const CategoriesBreadcrumbs = ({
  cities,
  city,
  categories,
  categoryModel,
  uiDirection
}: BreadcrumbsPropsType) => {
  const getBreadcrumb = category => {
    const title = category.isRoot() ? CityModel.findCityName(cities, city) : category.title
    return new BreadcrumbModel({
      title,
      link: urlFromPath(category.path),
      node: <Link to={category.path} key={category.path}>{title}</Link>
    })
  }
  return <Breadcrumbs ancestorBreadcrumbs={categories.getAncestors(categoryModel).map(getBreadcrumb)}
                      currentBreadcrumb={getBreadcrumb(categoryModel)} direction={uiDirection} />
}

type PropsType = {|
  categories: CategoriesMapModel,
  cities: Array<CityModel>,
  path: string,
  city: string,
  t: TFunction,
  language: string,
  uiDirection: UiDirectionType
|}
/**
 * Displays a CategoryTable, CategoryList or a single category as page matching the route /<city>/<language>*
 */
export const CategoriesPage = ({
  categories,
  language,
  cities,
  city,
  uiDirection,
  t,
  path
}: PropsType) => {
  const formatter = useContext(DateFormatterContext)
  const categoryModel = categories.findCategoryByPath(path)

  if (categoryModel) {
    return <div>
      <CategoriesBreadcrumbs categories={categories} categoryModel={categoryModel} uiDirection={uiDirection}
                             cities={cities} city={city} />
      <CategoriesContent categories={categories} categoryModel={categoryModel} formatter={formatter} t={t}/>
    </div>
  } else {
    const error = new NotFoundError({
      type: 'category',
      id: path,
      city: city,
      language
    })
    return <FailureSwitcher error={error} />
  }
}

const mapStateToProps = (state: StateType) => ({
  uiDirection: state.uiDirection,
  language: state.location.payload.language,
  city: state.location.payload.city,
  path: state.location.pathname
})

export default withTranslation('layout')(connect<*, *, *, *, *, *>(mapStateToProps)(CategoriesPage))
