// @flow

import * as React from 'react'
import { CategoriesMapModel, CategoryModel } from 'api-client'
import DateFormatter from 'api-client/src/i18n/DateFormatter'
import Page from '../../../modules/common/components/Page'
import Tiles from '../../../modules/common/components/Tiles'
import CategoryList from './CategoryList'
import TileModel from '../../../modules/common/models/TileModel'
import { TFunction } from 'i18next'
import { push } from 'redux-first-router'

const getTileModels = (categories: Array<CategoryModel>): Array<TileModel> => {
  return categories.map(category => new TileModel({
    title: category.title,
    path: category.path,
    thumbnail: category.thumbnail,
    isExternalUrl: false,
    postData: null
  }))
}

type PropsType = {|
  categories: CategoriesMapModel,
  categoryModel: CategoryModel,
  t: typeof TFunction,
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
}: PropsType) => {
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
    category={categoryModel}
    onInternalLinkClick={push}
    formatter={formatter} />
}

export default CategoriesContent
