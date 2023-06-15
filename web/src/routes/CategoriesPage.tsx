import moment from 'moment'
import React, { ReactElement, useCallback, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Navigate, useParams } from 'react-router-dom'

import {
  CATEGORIES_ROUTE,
  CategoriesMapModel,
  CategoryModel,
  cityContentPath,
  createCategoryChildrenEndpoint,
  createCategoryParentsEndpoint,
  NotFoundError,
  ResponseError,
  useLoadAsync,
  useLoadFromEndpoint,
} from 'api-client'
import { config } from 'translations'

import { CityRouteProps } from '../CityContentSwitcher'
import Breadcrumbs from '../components/Breadcrumbs'
import CategoriesContent from '../components/CategoriesContent'
import CategoriesToolbar from '../components/CategoriesToolbar'
import CityContentLayout from '../components/CityContentLayout'
import FailureSwitcher from '../components/FailureSwitcher'
import Helmet from '../components/Helmet'
import LoadingSpinner from '../components/LoadingSpinner'
import buildConfig from '../constants/buildConfig'
import { cmsApiBaseUrl } from '../constants/urls'
import DateFormatterContext from '../contexts/DateFormatterContext'
import usePreviousProp from '../hooks/usePreviousProp'
import useWindowDimensions from '../hooks/useWindowDimensions'
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

const CategoriesPage = ({ cityModel, pathname, languages, cityCode, languageCode }: CityRouteProps): ReactElement => {
  const previousPathname = usePreviousProp({ prop: pathname })
  const categoryId = useParams()['*']
  const { t } = useTranslation('layout')
  const formatter = useContext(DateFormatterContext)
  const uiDirection = config.getScriptDirection(languageCode)
  const { viewportSmall } = useWindowDimensions()

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

  if (!categoryId && categories) {
    // The root category is not delivered via our endpoints
    categories.push(
      new CategoryModel({
        root: true,
        path: pathname,
        title: cityModel.name,
        parentPath: '',
        content: '',
        thumbnail: '',
        order: -1,
        availableLanguages: new Map(),
        lastUpdate: moment(0),
      })
    )
  }

  const category = categories?.find(it => it.path === pathname)

  const toolbar = (openFeedback: React.Dispatch<React.SetStateAction<boolean>>) => (
    <CategoriesToolbar
      category={category}
      cityCode={cityCode}
      languageCode={languageCode}
      openFeedbackModal={openFeedback}
      hasDivider={viewportSmall}
    />
  )

  const languageChangePaths = languages.map(({ code, name }) => {
    const isCurrentLanguage = code === languageCode
    const path = category?.isRoot()
      ? cityContentPath({ cityCode, languageCode: code })
      : category?.availableLanguages.get(code) || null

    return {
      path: isCurrentLanguage ? pathname : path,
      name,
      code,
    }
  })

  const locationLayoutParams = {
    cityModel,
    viewportSmall,
    feedbackTargetInformation: category && !category.isRoot() ? { slug: category.slug } : null,
    languageChangePaths,
    route: CATEGORIES_ROUTE,
    languageCode,
    toolbar,
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
    .map((categoryModel: CategoryModel) => getBreadcrumb(categoryModel, cityModel.name))

  const metaDescription = t('categories:metaDescription', { appName: buildConfig().appName })
  const pageTitle = `${!category.isRoot() ? `${category.title} - ` : ''}${cityModel.name}`

  return (
    <CityContentLayout isLoading={false} {...locationLayoutParams}>
      <Helmet
        pageTitle={pageTitle}
        metaDescription={metaDescription}
        languageChangePaths={languageChangePaths}
        cityModel={cityModel}
      />
      <Breadcrumbs
        ancestorBreadcrumbs={ancestorBreadcrumbs}
        currentBreadcrumb={getBreadcrumb(category, cityModel.name)}
        direction={uiDirection}
      />
      <CategoriesContent
        categories={new CategoriesMapModel(categories)}
        categoryModel={category}
        formatter={formatter}
        t={t}
      />
    </CityContentLayout>
  )
}

export default CategoriesPage
