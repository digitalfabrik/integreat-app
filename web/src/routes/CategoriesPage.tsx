import React, { ReactElement, useCallback, useContext, useEffect, useRef } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import LocationLayout from '../components/LocationLayout'
import {
  CATEGORIES_ROUTE,
  CategoriesMapModel,
  CategoryModel,
  CityModel,
  createCategoryChildrenEndpoint,
  createCategoryParentsEndpoint,
  LanguageModel,
  normalizePath,
  NotFoundError,
  Payload,
  ResponseError,
  useLoadFromEndpoint
} from 'api-client'
import { FeedbackRatingType } from '../components/FeedbackToolbarItem'
import { useTranslation } from 'react-i18next'
import BreadcrumbModel from '../models/BreadcrumbModel'
import { urlFromPath } from '../utils/stringUtils'
import FailureSwitcher from '../components/FailureSwitcher'
import Breadcrumbs from '../components/Breadcrumbs'
import CategoriesContent from '../components/CategoriesContent'
import DateFormatterContext from '../contexts/DateFormatterContext'
import CategoriesToolbar from '../components/CategoriesToolbar'
import { cmsApiBaseUrl } from '../constants/urls'
import LoadingSpinner from '../components/LoadingSpinner'
import moment from 'moment'
import { config } from 'translations'
import { createPath } from './index'
import useWindowDimensions from '../hooks/useWindowDimensions'
import Helmet from '../components/Helmet'
import buildConfig from '../constants/buildConfig'

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

type PropsType = {
  cities: Array<CityModel>
  cityModel: CityModel
  languages: Array<LanguageModel>
  languageModel: LanguageModel
} & RouteComponentProps<{ cityCode: string; languageCode: string; categoryId?: string }>

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

  const requestChildren = useCallback(async () => {
    return createCategoryChildrenEndpoint(cmsApiBaseUrl).request({
      city: cityCode,
      language: languageCode,
      // We show tiles for the root category so only first level children are needed
      depth: categoryId ? 2 : 1,
      cityContentPath: pathname
    })
  }, [cityCode, languageCode, pathname, categoryId])
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

  const toolbar = (openFeedback: (rating: FeedbackRatingType) => void) => {
    return (
      <CategoriesToolbar
        category={category}
        cityCode={cityCode}
        languageCode={languageCode}
        openFeedbackModal={openFeedback}
        viewportSmall={viewportSmall}
      />
    )
  }

  const languageChangePaths = languages.map(({ code, name }) => {
    const rootPath = createPath(CATEGORIES_ROUTE, { cityCode, languageCode: code })
    return {
      path: category && !category.isRoot() ? category.availableLanguages.get(code) || null : rootPath,
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
    pathname,
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

  const metaDescription = t('app:metaDescription', { appName: buildConfig().appName })
  const pageTitle = `${category && !category.isRoot() ? `${category.title} - ` : ''}${cityModel.name}`

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
