import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { getCategoryTiles } from 'shared'
import { CategoriesMapModel, CategoryModel } from 'shared/api'

import { CityRouteProps } from '../CityContentSwitcher'
import CategoryList from './CategoryList'
import EmbeddedOffers from './EmbeddedOffers'
import OrganizationContentInfo from './OrganizationContentInfo'
import Page from './Page'
import Tiles from './Tiles'

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
  const navigate = useNavigate()
  const { t } = useTranslation('layout')

  if (categories.isLeaf(categoryModel)) {
    return (
      <Page
        title={categoryModel.title}
        content={categoryModel.content}
        lastUpdate={categoryModel.lastUpdate}
        onInternalLinkClick={navigate}
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
    return <Tiles tiles={getCategoryTiles({ categories: children, cityCode })} title={t('localInformation')} />
  }

  return (
    <CategoryList
      items={children.map(it => ({ category: it, subCategories: categories.getChildren(it) }))}
      category={categoryModel}
      onInternalLinkClick={navigate}
    />
  )
}

export default CategoriesContent
