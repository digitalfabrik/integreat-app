import React, { ReactElement, useCallback, useContext } from 'react'
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
  NotFoundError,
  useLoadFromEndpoint
} from 'api-client'
import { FeedbackRatingType } from '../components/FeedbackToolbarItem'
import { useTranslation } from 'react-i18next'
import BreadcrumbModel from '../models/BreadcrumbModel'
import urlFromPath from '../services/urlFromPath'
import FailureSwitcher from '../components/FailureSwitcher'
import Breadcrumbs from '../components/Breadcrumbs'
import CategoriesContent from '../components/CategoriesContent'
import DateFormatterContext from '../context/DateFormatterContext'
import CategoriesToolbar from '../components/CategoriesToolbar'
import { cmsApiBaseUrl } from '../constants/urls'
import Layout from '../components/Layout'
import LoadingSpinner from '../components/LoadingSpinner'
import GeneralHeader from '../components/GeneralHeader'
import GeneralFooter from '../components/GeneralFooter'
import moment from 'moment'

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

const CategoriesPage = ({ cityModel, match, location }: PropsType): ReactElement => {
  const { cityCode, languageCode, categoryId } = match.params
  const { pathname } = location
  const { t } = useTranslation('layout')
  const formatter = useContext(DateFormatterContext)
  const uiDirection = 'ltr'
  const viewportSmall = false

  const requestCategories = useCallback(async () => {
    return createCategoryChildrenEndpoint(cmsApiBaseUrl).request({
      city: cityCode,
      language: languageCode,
      depth: 2,
      cityContentPath: pathname
    })
  }, [cityCode, languageCode, pathname])
  const { data: categories, loading: categoriesLoading, error: categoriesError } = useLoadFromEndpoint<CategoryModel[]>(
    requestCategories
  )

  const requestParents = useCallback(async () => {
    return createCategoryParentsEndpoint(cmsApiBaseUrl).request({
      city: cityCode,
      language: languageCode,
      cityContentPath: pathname
    })
  }, [cityCode, languageCode, pathname])
  const { data, loading: parentsLoading, error: parentsError } = useLoadFromEndpoint<CategoryModel[]>(requestParents)
  const parents = categoryId ? data : []

  if (!categoryId && categories) {
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

  if (categoriesLoading || parentsLoading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    )
  }

  if (!category || !parents || !categories) {
    const error = categoriesError || parentsError || new NotFoundError({
      type: 'category',
      id: pathname,
      city: cityCode,
      language: languageCode
    })

    return (
      <Layout
        header={<GeneralHeader languageCode={languageCode} viewportSmall={false} />}
        footer={<GeneralFooter language={languageCode} />}>
        <FailureSwitcher error={error} />
      </Layout>
    )
  }

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

  const ancestorBreadcrumbs = parents.map(categoryModel => getBreadcrumb(categoryModel, cityModel.name))

  return (
    <LocationLayout
      cityModel={cityModel}
      toolbar={toolbar}
      viewportSmall={false}
      feedbackTargetInformation={null}
      languageChangePaths={null}
      isLoading={false}
      route={CATEGORIES_ROUTE}
      languageCode={languageCode}
      pathname={pathname}>
      <Breadcrumbs
        ancestorBreadcrumbs={ancestorBreadcrumbs}
        currentBreadcrumb={getBreadcrumb(category, cityModel.name)}
        direction={uiDirection}
      />
      <CategoriesContent categories={new CategoriesMapModel(categories)} categoryModel={category} formatter={formatter} t={t} />
    </LocationLayout>
  )
}

export default CategoriesPage
