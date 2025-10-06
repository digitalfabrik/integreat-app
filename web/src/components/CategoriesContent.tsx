import React, { ReactElement } from 'react'

import { getCategoryTiles } from 'shared'
import { CategoriesMapModel, CategoryModel } from 'shared/api'

import { CityRouteProps } from '../CityContentSwitcher'
import CategoryListItem from './CategoryListItem'
import EmbeddedOffers from './EmbeddedOffers'
import OrganizationContentInfo from './OrganizationContentInfo'
import Page from './Page'
import Tiles from './Tiles'
import List from './base/List'

type CategoriesContentProps = {
  categories: CategoriesMapModel
  categoryModel: CategoryModel
} & CityRouteProps

const CategoriesContent = ({
  categories,
  categoryModel,
  city,
  pathname,
  cityCode,
  languageCode,
}: CategoriesContentProps): ReactElement => {
  const children = categories.getChildren(categoryModel)

  if (categories.isLeaf(categoryModel)) {
    return (
      <Page
        title={categoryModel.title}
        content={categoryModel.content}
        lastUpdate={categoryModel.lastUpdate}
        AfterContent={
          categoryModel.organization && <OrganizationContentInfo organization={categoryModel.organization} />
        }
        Footer={
          <EmbeddedOffers
            category={categoryModel}
            city={city}
            pathname={pathname}
            cityCode={cityCode}
            languageCode={languageCode}
          />
        }
      />
    )
  }

  if (categoryModel.isRoot()) {
    return <Tiles tiles={getCategoryTiles({ categories: children, cityCode })} title={null} />
  }

  return (
    <Page
      title={categoryModel.title}
      content={categoryModel.content}
      lastUpdate={categoryModel.lastUpdate}
      Footer={
        <List
          items={children.map(it => (
            <CategoryListItem key={it.path} category={it} subCategories={categories.getChildren(it)} />
          ))}
        />
      }
    />
  )
}

export default CategoriesContent
