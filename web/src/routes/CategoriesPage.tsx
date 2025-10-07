import { DateTime } from 'luxon'
import React, { ReactElement, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Navigate, useParams } from 'react-router'

import { cityContentPath } from 'shared'
import {
  CategoriesMapModel,
  CategoryModel,
  createCategoryChildrenEndpoint,
  createCategoryParentsEndpoint,
  NotFoundError,
  ResponseError,
  useLoadAsync,
  useLoadFromEndpoint,
} from 'shared/api'

import { CityRouteProps } from '../CityContentSwitcher'
import Breadcrumbs from '../components/Breadcrumbs'
import CategoriesContent from '../components/CategoriesContent'
import CityContentLayout, { CityContentLayoutProps } from '../components/CityContentLayout'
import CityContentToolbar from '../components/CityContentToolbar'
import FailureSwitcher from '../components/FailureSwitcher'
import Helmet from '../components/Helmet'
import LoadingSpinner from '../components/LoadingSpinner'
import buildConfig from '../constants/buildConfig'
import { cmsApiBaseUrl } from '../constants/urls'
import usePreviousProp from '../hooks/usePreviousProp'
import useTtsPlayer from '../hooks/useTtsPlayer'
import BreadcrumbModel from '../models/BreadcrumbModel'

const CATEGORY_NOT_FOUND_STATUS_CODE = 400

const getBreadcrumb = (category: CategoryModel, cityName: string) => {
  const title = category.isRoot() ? cityName : category.title
  return new BreadcrumbModel({
    title,
    pathname: category.path,
    node: (
      <Link to={category.path} key={category.path}>
        {title}
      </Link>
    ),
  })
}

const CategoriesPage = ({ city, pathname, cityCode, languageCode }: CityRouteProps): ReactElement | null => {
  const previousPathname = usePreviousProp({ prop: pathname })
  const categoryId = useParams()['*']
  const { t } = useTranslation('layout')

  const {
    data: categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useLoadFromEndpoint(createCategoryChildrenEndpoint, cmsApiBaseUrl, {
    city: cityCode,
    language: languageCode,
    // We show tiles for the root category so only first level children are needed
    depth: categoryId ? 2 : 1,
    cityContentPath: pathname,
  })

  const currentCategory = categories?.find(it => it.path === pathname)
  useTtsPlayer(currentCategory, languageCode)

  const requestParents = useCallback(async () => {
    if (!categoryId) {
      // The endpoint does not work for the root category, just return an empty array
      return []
    }
    const { data } = await createCategoryParentsEndpoint(cmsApiBaseUrl).request({
      city: cityCode,
      language: languageCode,
      cityContentPath: pathname,
    })

    if (!data) {
      throw new Error('Data missing!')
    }

    return data
  }, [cityCode, languageCode, pathname, categoryId])
  const { data: parents, loading: parentsLoading, error: parentsError } = useLoadAsync(requestParents)

  if (!city) {
    return null
  }

  if (!categoryId && categories) {
    // The root category is not delivered via our endpoints
    categories.push(
      new CategoryModel({
        root: true,
        path: pathname,
        title: city.name,
        parentPath: '',
        content: '',
        thumbnail: '',
        order: -1,
        availableLanguages: {},
        lastUpdate: DateTime.fromMillis(0),
        organization: null,
        embeddedOffers: [],
      }),
    )
  }

  const category = categories?.find(it => it.path === pathname)
  const languageChangePaths = city.languages.map(({ code, name }) => {
    const isCurrentLanguage = code === languageCode
    const path = category?.isRoot()
      ? cityContentPath({ cityCode, languageCode: code })
      : category?.availableLanguages[code] || null

    return {
      path: isCurrentLanguage ? pathname : path,
      name,
      code,
    }
  })

  const pageTitle = `${category && !category.isRoot() ? category.title : t('localInformation')} - ${city.name}`
  const locationLayoutParams: Omit<CityContentLayoutProps, 'isLoading'> = {
    city,
    languageChangePaths,
    languageCode,
    category,
    pageTitle,
    Toolbar: <CityContentToolbar slug={category && !category.isRoot() ? category.slug : undefined} />,
  }

  if (categoriesLoading || parentsLoading || pathname !== previousPathname) {
    return (
      <CityContentLayout isLoading {...locationLayoutParams}>
        <LoadingSpinner />
      </CityContentLayout>
    )
  }

  if (!category || !parents || !categories) {
    // This adds support for the old paths of categories by redirecting to the new path
    // The children endpoint always returns the category with the new path at the first position in the response
    const newSlugCategory = categories?.[0]
    if (newSlugCategory) {
      return <Navigate to={newSlugCategory.path} replace />
    }

    const notFoundError = new NotFoundError({ type: 'category', id: pathname, city: cityCode, language: languageCode })
    const error =
      // The cms returns a 400 BAD REQUEST if the path is not a valid categories path
      categoriesError instanceof ResponseError && categoriesError.response.status === CATEGORY_NOT_FOUND_STATUS_CODE
        ? notFoundError
        : categoriesError || parentsError || notFoundError

    return (
      <CityContentLayout isLoading={false} {...locationLayoutParams}>
        <FailureSwitcher error={error} />
      </CityContentLayout>
    )
  }

  const ancestorBreadcrumbs = parents
    .sort((a, b) => a.parentPath.length - b.parentPath.length)
    .map((categoryModel: CategoryModel) => getBreadcrumb(categoryModel, city.name))
  const breadcrumbs = [...ancestorBreadcrumbs, getBreadcrumb(category, city.name)]

  const metaDescription = t('categories:metaDescription', { appName: buildConfig().appName })

  return (
    <CityContentLayout isLoading={false} {...locationLayoutParams}>
      <Helmet
        pageTitle={pageTitle}
        metaDescription={metaDescription}
        languageChangePaths={languageChangePaths}
        cityModel={city}
      />
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <CategoriesContent
        city={city}
        cityCode={cityCode}
        pathname={pathname}
        languageCode={languageCode}
        categories={new CategoriesMapModel(categories)}
        categoryModel={category}
      />
    </CityContentLayout>
  )
}

export default CategoriesPage
