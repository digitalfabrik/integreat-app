import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { getCategoryTiles } from 'shared'
import { CategoriesMapModel, CategoryModel } from 'shared/api'

import { RegionRouteProps } from '../RegionContentNavigator'
import CategoryListItem from './CategoryListItem'
import EmbeddedOffers from './EmbeddedOffers'
import OrganizationContentInfo from './OrganizationContentInfo'
import Page from './Page'
import Tiles from './Tiles'
import List from './base/List'

type CategoriesContentProps = {
  categories: CategoriesMapModel
  categoryModel: CategoryModel
} & RegionRouteProps

const CategoriesContent = ({
  categories,
  categoryModel,
  region,
  pathname,
  regionCode,
  languageCode,
}: CategoriesContentProps): ReactElement => {
  const children = categories.getChildren(categoryModel)
  const { t } = useTranslation('layout')

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
            region={region}
            pathname={pathname}
            regionCode={regionCode}
            languageCode={languageCode}
          />
        }
      />
    )
  }

  if (categoryModel.isRoot()) {
    return <Tiles tiles={getCategoryTiles({ categories: children, regionCode })} title={t('localInformation')} />
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
