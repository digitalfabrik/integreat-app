import { useQuery } from '@tanstack/react-query'
import { DateTime } from 'luxon'
import React, { ReactElement, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, useParams } from 'react-router'

import { regionContentPath } from 'shared'
import {
  CategoriesMapModel,
  CategoryModel,
  createCategoryChildrenEndpoint,
  createCategoryParentsEndpoint,
  NotFoundError,
  ResponseError,
} from 'shared/api'

import { BreadcrumbProps } from '../components/Breadcrumb'
import Breadcrumbs from '../components/Breadcrumbs'
import CategoriesContent from '../components/CategoriesContent'
import FailureSwitcherWithHelmet from '../components/FailureSwitcherWithHelmet'
import Helmet from '../components/Helmet'
import RegionContentLayout, { RegionContentLayoutProps } from '../components/RegionContentLayout'
import RegionContentToolbar from '../components/RegionContentToolbar'
import SkeletonHeader from '../components/SkeletonHeader'
import SkeletonList from '../components/SkeletonList'
import SkeletonPage from '../components/SkeletonPage'
import SkeletonTiles from '../components/SkeletonTiles'
import buildConfig from '../constants/buildConfig'
import { cmsApiBaseUrl } from '../constants/urls'
import usePreviousProp from '../hooks/usePreviousProp'
import useQueryFromEndpoint from '../hooks/useQueryFromEndpoint'
import useTtsPlayer from '../hooks/useTtsPlayer'
import { RegionRouteProps } from './index'

const CATEGORY_NOT_FOUND_STATUS_CODE = 400

const useCategoryData = (
  regionCode: string,
  languageCode: string,
  pathname: string,
  categoryId: string | undefined,
) => {
  const {
    data: rawCategories,
    isPending: categoriesLoading,
    error: categoriesError,
  } = useQueryFromEndpoint(createCategoryChildrenEndpoint, cmsApiBaseUrl, {
    region: regionCode,
    language: languageCode,
    // We show tiles for the root category so only first level children are needed
    depth: categoryId ? 2 : 1,
    regionContentPath: pathname,
  })

  const loadCategoryParents = async () => {
    if (!categoryId) {
      // The endpoint does not work for the root category, just return an empty array
      return []
    }
    const { data } = await createCategoryParentsEndpoint(cmsApiBaseUrl).request({
      region: regionCode,
      language: languageCode,
      regionContentPath: pathname,
    })

    if (!data) {
      throw new Error('Data missing!')
    }

    return data
  }

  const {
    data: parents,
    isPending: parentsLoading,
    error: parentsError,
  } = useQuery({
    queryKey: ['categoryParents', [regionCode, languageCode, pathname, categoryId]],
    queryFn: loadCategoryParents,
  })

  // The root category is not delivered via our endpoints
  const categories = useMemo(
    () =>
      !categoryId && rawCategories
        ? [
            ...rawCategories,
            new CategoryModel({
              id: -1,
              root: true,
              path: pathname,
              title: 'root',
              parentPath: '',
              content: '',
              thumbnail: '',
              order: -1,
              availableLanguages: {},
              lastUpdate: DateTime.fromMillis(0),
              organization: null,
              embeddedOffers: [],
            }),
          ]
        : rawCategories,
    [categoryId, rawCategories, pathname],
  )

  return {
    categories,
    categoriesLoading,
    categoriesError,
    parents,
    parentsLoading,
    parentsError,
  }
}

const getBreadcrumb = (category: CategoryModel, regionName: string): BreadcrumbProps => ({
  title: category.isRoot() ? regionName : category.title,
  to: category.path,
})

const CategoriesPage = ({ region, pathname, regionCode, languageCode }: RegionRouteProps): ReactElement | null => {
  const previousPathname = usePreviousProp({ prop: pathname })
  const categoryId = useParams()['*']
  const { t } = useTranslation('layout')

  const { categories, categoriesLoading, categoriesError, parents, parentsLoading, parentsError } = useCategoryData(
    regionCode,
    languageCode,
    pathname,
    categoryId,
  )

  const currentCategory = categories?.find(it => it.path === pathname)
  useTtsPlayer(currentCategory, languageCode)

  const isLeafPage = categories && currentCategory ? new CategoriesMapModel(categories).isLeaf(currentCategory) : null

  if (!region) {
    return null
  }

  const category = categories?.find(it => it.path === pathname)
  const languageChangePaths = region.languages.map(({ code, name }) => {
    const isCurrentLanguage = code === languageCode
    const path = category?.isRoot()
      ? regionContentPath({ regionCode, languageCode: code })
      : category?.availableLanguages[code] || null

    return {
      path: isCurrentLanguage ? pathname : path,
      name,
      code,
    }
  })

  const pageTitle = `${category && !category.isRoot() ? category.title : t('localInformation')} - ${region.name}`
  const locationLayoutParams: Omit<RegionContentLayoutProps, 'isLoading'> = {
    region,
    languageChangePaths,
    languageCode,
    category,
    pageTitle,
    slug: category && !category.isRoot() ? category.slug : null,
    toolbar: <RegionContentToolbar />,
  }
  const isDataAvailable = !categories || !parents || !category
  const isLoadingData = categoriesLoading || parentsLoading || pathname !== previousPathname

  const loadSkeleton = () => {
    if (!categoryId) {
      return <SkeletonTiles />
    }
    if (isLeafPage === null) {
      return null
    }
    return (
      <>
        {isLeafPage ? (
          <SkeletonPage />
        ) : (
          <>
            <SkeletonHeader />
            <SkeletonList />
          </>
        )}
      </>
    )
  }

  if (isDataAvailable) {
    if (isLoadingData) {
      return (
        <RegionContentLayout isLoading {...locationLayoutParams}>
          {loadSkeleton()}
        </RegionContentLayout>
      )
    }
    // This adds support for the old paths of categories by redirecting to the new path
    // The children endpoint always returns the category with the new path at the first position in the response
    const newSlugCategory = categories?.[0]
    if (newSlugCategory) {
      return <Navigate to={newSlugCategory.path} replace />
    }

    const notFoundError = new NotFoundError({
      type: 'category',
      id: pathname,
      region: regionCode,
      language: languageCode,
    })
    const error =
      // The cms returns a 400 BAD REQUEST if the path is not a valid categories path
      categoriesError instanceof ResponseError && categoriesError.response.status === CATEGORY_NOT_FOUND_STATUS_CODE
        ? notFoundError
        : categoriesError || parentsError || notFoundError

    return (
      <RegionContentLayout isLoading={false} {...locationLayoutParams}>
        <FailureSwitcherWithHelmet error={error} />
      </RegionContentLayout>
    )
  }

  const ancestorBreadcrumbs = parents
    .sort((a, b) => a.parentPath.length - b.parentPath.length)
    .map((categoryModel: CategoryModel) => getBreadcrumb(categoryModel, region.name))
  const breadcrumbs = [...ancestorBreadcrumbs, getBreadcrumb(category, region.name)]

  const metaDescription = t('categories:metaDescription', { appName: buildConfig().appName })

  return (
    <RegionContentLayout isLoading={false} {...locationLayoutParams}>
      <Helmet
        pageTitle={pageTitle}
        metaDescription={metaDescription}
        languageChangePaths={languageChangePaths}
        regionModel={region}
      />
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      {isLoadingData ? (
        loadSkeleton()
      ) : (
        <CategoriesContent
          region={region}
          regionCode={regionCode}
          pathname={pathname}
          languageCode={languageCode}
          categories={new CategoriesMapModel(categories)}
          categoryModel={category}
        />
      )}
    </RegionContentLayout>
  )
}

export default CategoriesPage
