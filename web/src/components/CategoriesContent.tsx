import { TFunction } from 'i18next'
import React, { ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'

import { CategoriesMapModel, CategoryModel } from 'api-client'

import { CityRouteProps } from '../CityContentSwitcher'
import TileModel from '../models/TileModel'
import CategoryList from './CategoryList'
import EmbeddedOffer from './EmbeddedOffer'
import OrganizationContentInfo from './OrganizationContentInfo'
import Page from './Page'
import Tiles from './Tiles'

const getTileModels = (categories: Array<CategoryModel>): Array<TileModel> =>
  categories.map(
    category =>
      new TileModel({
        title: category.title,
        path: category.path,
        thumbnail: category.thumbnail,
      }),
  )

type CategoriesContentProps = {
  categories: CategoriesMapModel
  categoryModel: CategoryModel
  t: TFunction
} & CityRouteProps

/**
 * Returns the content to be displayed, based on the current category, which is
 * a) page with information
 * b) table with categories
 * c) list with categories
 */
const CategoriesContent = ({ categories, categoryModel, t, ...props }: CategoriesContentProps): ReactElement => {
  const children = categories.getChildren(categoryModel)
  const navigate = useNavigate()

  if (categories.isLeaf(categoryModel)) {
    // last level, our category is a simple page
    return (
      <Page
        title={categoryModel.title}
        content={categoryModel.content}
        lastUpdate={categoryModel.lastUpdate}
        onInternalLinkClick={navigate}
        AfterContent={
          categoryModel.organization && <OrganizationContentInfo organization={categoryModel.organization} />
        }
        Footer={categoryModel.embeddedOffers[0] && <EmbeddedOffer offer={categoryModel.embeddedOffers[0]} {...props} />}
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
    />
  )
}

export default CategoriesContent
