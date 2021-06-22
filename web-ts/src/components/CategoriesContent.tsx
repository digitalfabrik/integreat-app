import * as React from 'react'
import { CategoriesMapModel, CategoryModel, DateFormatter } from 'api-client'
import Page from './Page'
import Tiles from './Tiles'
import CategoryList from './CategoryList'
import TileModel from '../models/TileModel'
import { TFunction } from 'i18next'
import { useHistory } from 'react-router-dom'
import { ReactElement } from 'react'

const getTileModels = (categories: Array<CategoryModel>): Array<TileModel> => {
  return categories.map(
    category =>
      new TileModel({
        title: category.title,
        path: category.path,
        thumbnail: category.thumbnail,
        isExternalUrl: false,
        postData: null
      })
  )
}

type PropsType = {
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
const CategoriesContent = ({ categories, categoryModel, formatter, t }: PropsType): ReactElement => {
  const children = categories.getChildren(categoryModel)
  const history = useHistory()

  if (categories.isLeaf(categoryModel)) {
    // last level, our category is a simple page
    return (
      <Page
        title={categoryModel.title}
        content={categoryModel.content}
        lastUpdate={categoryModel.lastUpdate}
        formatter={formatter}
        onInternalLinkClick={history.push}
      />
    )
  } else if (categoryModel.isRoot()) {
    // first level, we want to display a table with all first order categories
    return <Tiles tiles={getTileModels(children)} title={t('localInformation')} />
  }
  // some level between, we want to display a list
  return (
    <CategoryList
      categories={children.map(model => ({
        model,
        subCategories: categories.getChildren(model)
      }))}
      category={categoryModel}
      onInternalLinkClick={history.push}
      formatter={formatter}
    />
  )
}

export default CategoriesContent
