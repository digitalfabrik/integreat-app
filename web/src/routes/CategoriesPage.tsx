import moment from 'moment'
import React, { ReactElement, useCallback, useContext, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import {
  CATEGORIES_ROUTE,
  CategoriesMapModel,
  CategoryModel,
  cityContentPath,
  createCategoryChildrenEndpoint,
  createCategoryParentsEndpoint,
  normalizePath,
  NotFoundError,
  Payload,
  ResponseError,
  useLoadFromEndpoint
} from 'api-client'
import { config } from 'translations'

import { CityRouteProps } from '../CityContentSwitcher'
import Breadcrumbs from '../components/Breadcrumbs'
import CategoriesContent from '../components/CategoriesContent'
import CategoriesToolbar from '../components/CategoriesToolbar'
import FailureSwitcher from '../components/FailureSwitcher'
import { FeedbackRatingType } from '../components/FeedbackToolbarItem'
import Helmet from '../components/Helmet'
import LoadingSpinner from '../components/LoadingSpinner'
import LocationLayout from '../components/LocationLayout'
import buildConfig from '../constants/buildConfig'
import { cmsApiBaseUrl } from '../constants/urls'
import DateFormatterContext from '../contexts/DateFormatterContext'
import useWindowDimensions from '../hooks/useWindowDimensions'
import BreadcrumbModel from '../models/BreadcrumbModel'
import { urlFromPath } from '../utils/stringUtils'
import { RouteProps } from './index'

const CATEGORY_NOT_FOUND_STATUS_CODE = 400

const getBreadcrumb = (category: CategoryModel, cityName: string) => {
  const title = category.isRoot() ? cityName : category.title
  return new BreadcrumbModel({
    title,
    link: urlFromPath(category.path),
    node: (
      <Link to={category.path} key={category.path}>
        {title}
      </Link>
    )
  })
}

type PropsType = CityRouteProps & RouteProps<typeof CATEGORIES_ROUTE>

const CategoriesPage = ({ cityModel, match, location, languages }: PropsType): ReactElement => {
  const previousPathname = useRef<string | null | undefined>(null)
  const { cityCode, languageCode, categoryId } = match.params
  const pathname = normalizePath(location.pathname)
  const { t } = useTranslation('layout')
  const formatter = useContext(DateFormatterContext)
  const uiDirection = config.getScriptDirection(languageCode)
  const { viewportSmall } = useWindowDimensions()

  useEffect(() => {
    // Hooks are only run after render, therefore if the user navigates, the old data is still valid for a moment.
    // To prevent flickering, render a loading spinner if the pathname has changed since the last render.
    previousPathname.current = pathname
  }, [pathname])

  const requestChildren = useCallback(
    async () =>
      createCategoryChildrenEndpoint(cmsApiBaseUrl).request({
        city: cityCode,
        language: languageCode,
        // We show tiles for the root category so only first level children are needed
        depth: categoryId ? 2 : 1,
        cityContentPath: pathname
      }),
    [cityCode, languageCode, pathname, categoryId]
  )
  const { data: categories, loading: categoriesLoading, error: categoriesError } = useLoadFromEndpoint(requestChildren)

  const requestParents = useCallback(async () => {
    if (!categoryId) {
      // The endpoint does not work for the root category, just return an empty array
      return new Payload(false, null, [])
    }
    return createCategoryParentsEndpoint(cmsApiBaseUrl).request({
      city: cityCode,
      language: languageCode,
      cityContentPath: pathname
    })
  }, [cityCode, languageCode, pathname, categoryId])
  const { data: parents, loading: parentsLoading, error: parentsError } = useLoadFromEndpoint(requestParents)

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
        hash: ''
      })
    )
  }

  const category = categories?.find(it => it.path === pathname)

  const toolbar = (openFeedback: (rating: FeedbackRatingType) => void) => (
    <CategoriesToolbar
      category={category}
      cityCode={cityCode}
      languageCode={languageCode}
      openFeedbackModal={openFeedback}
      viewportSmall={viewportSmall}
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
      code
    }
  })

  const locationLayoutParams = {
    cityModel,
    viewportSmall,
    feedbackTargetInformation: category && !category.isRoot() ? { path: category.path } : null,
    languageChangePaths,
    route: CATEGORIES_ROUTE,
    languageCode,
    toolbar
  }

  if (categoriesLoading || parentsLoading || pathname !== previousPathname.current) {
    return (
      <LocationLayout isLoading {...locationLayoutParams}>
        <LoadingSpinner />
      </LocationLayout>
    )
  }

  if (!category || !parents || !categories) {
    const notFoundError = new NotFoundError({ type: 'category', id: pathname, city: cityCode, language: languageCode })
    const error =
      // The cms returns a 400 BAD REQUEST if the path is not a valid categories path
      categoriesError instanceof ResponseError && categoriesError.response.status === CATEGORY_NOT_FOUND_STATUS_CODE
        ? notFoundError
        : categoriesError || parentsError || notFoundError

    return (
      <LocationLayout isLoading={false} {...locationLayoutParams}>
        <FailureSwitcher error={error} />
      </LocationLayout>
    )
  }

  const ancestorBreadcrumbs = parents
    .reverse()
    .map((categoryModel: CategoryModel) => getBreadcrumb(categoryModel, cityModel.name))

  const metaDescription = t('categories:metaDescription', { appName: buildConfig().appName })
  const pageTitle = `${!category.isRoot() ? `${category.title} - ` : ''}${cityModel.name}`

  return (
    <LocationLayout isLoading={false} {...locationLayoutParams}>
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
    </LocationLayout>
  )
}

export default CategoriesPage
