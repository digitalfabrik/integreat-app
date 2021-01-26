// @flow

import * as React from 'react'
import { connect } from 'react-redux'
import { CategoriesMapModel, CategoryModel, CityModel, NotFoundError } from 'api-client'
import Breadcrumbs from '../../../modules/common/components/Breadcrumbs'
import Link from 'redux-first-router-link'
import FailureSwitcher from '../../../modules/common/components/FailureSwitcher'
import type { StateType } from '../../../modules/app/StateType'
import type { UiDirectionType } from '../../../modules/i18n/types/UiDirectionType'
import BreadcrumbModel from '../../../modules/common/BreadcrumbModel'
import urlFromPath from '../../../modules/common/utils/urlFromPath'
import { withTranslation } from 'react-i18next'
import { TFunction } from 'i18next'
import { useContext } from 'react'
import DateFormatterContext from '../../../modules/i18n/context/DateFormatterContext'
import CategoriesContent from '../components/CategoriesContent'

type PropsType = {|
  categories: CategoriesMapModel,
  cities: Array<CityModel>,
  path: string,
  city: string,
  t: TFunction,
  language: string,
  uiDirection: UiDirectionType
|}

const getBreadcrumb = (category: CategoryModel, cityName: string) => {
  const title = category.isRoot() ? cityName : category.title
  return new BreadcrumbModel({
    title,
    link: urlFromPath(category.path),
    node: <Link to={category.path} key={category.path}>{title}</Link>
  })
}
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
    const cityName = CityModel.findCityName(cities, city)
    const ancestorBreadcrumbs = categories.getAncestors(categoryModel)
      .map(categoryModel => getBreadcrumb(categoryModel, cityName))
    return <div>
      <Breadcrumbs ancestorBreadcrumbs={ancestorBreadcrumbs}
                   currentBreadcrumb={getBreadcrumb(categoryModel, cityName)}
                   direction={uiDirection} />
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
