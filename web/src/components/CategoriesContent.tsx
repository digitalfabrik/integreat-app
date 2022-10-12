import { TFunction } from 'i18next'
import * as React from 'react'
import { ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'

import { CategoriesMapModel, CategoryModel, DateFormatter } from 'api-client'

import TileModel from '../models/TileModel'
import CategoryList from './CategoryList'
import Page from './Page'
import Tiles from './Tiles'

const getTileModels = (categories: Array<CategoryModel>): Array<TileModel> =>
  categories.map(
    category =>
      new TileModel({
        title: category.title,
        path: category.path,
        thumbnail: category.thumbnail,
      })
  )

type CategoriesContentProps = {
  categories: CategoriesMapModel
  categoryModel: CategoryModel
  t: TFunction
  formatter: DateFormatter
}

/**
 * Returns the content to be displayed, based on the current category, which is
 * a) page with information
 * b) table with categories
 * c) list with categories
 */
const CategoriesContent = ({ categories, categoryModel, formatter, t }: CategoriesContentProps): ReactElement => {
  const children = categories.getChildren(categoryModel)
  const navigate = useNavigate()

  if (categories.isLeaf(categoryModel)) {
    // last level, our category is a simple page
    return (
      <Page
        title={categoryModel.title}
        content={categoryModel.content}
        lastUpdate={categoryModel.lastUpdate}
        formatter={formatter}
        onInternalLinkClick={navigate}
      />
    )
  }
  if (categoryModel.isRoot()) {
    // first level, we want to display a table with all first order categories
    return <Tiles tiles={getTileModels(children)} title={t('localInformation')} />
  }
  // some level between, we want to display a list
  return (
    <CategoryList
      items={children.map(it => ({ category: it, subCategories: categories.getChildren(it) }))}
      category={categoryModel}
      onInternalLinkClick={navigate}
      formatter={formatter}
    />
  )
}

export default CategoriesContent
