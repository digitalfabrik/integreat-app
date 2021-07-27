import React, { ReactElement, Suspense, useCallback, useContext } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import {
  CityModel,
  createPOIsEndpoint,
  LanguageModel,
  normalizePath,
  NotFoundError,
  PoiModel,
  POIS_ROUTE,
  useLoadFromEndpoint
} from 'api-client'
import LocationLayout from '../components/LocationLayout'
import LocationToolbar from '../components/LocationToolbar'
import { FeedbackRatingType } from '../components/FeedbackToolbarItem'
import DateFormatterContext from '../contexts/DateFormatterContext'
import PoiListItem from '../components/PoiListItem'
import useWindowDimensions from '../hooks/useWindowDimensions'
import { cmsApiBaseUrl } from '../constants/urls'
import { createPath } from './index'
import { useTranslation } from 'react-i18next'
import LoadingSpinner from '../components/LoadingSpinner'
import FailureSwitcher from '../components/FailureSwitcher'
import Page from '../components/Page'
import PageDetail from '../components/PageDetail'
import Caption from '../components/Caption'
import List from '../components/List'
import Helmet from '../components/Helmet'

type PropsType = {
  cities: Array<CityModel>
  cityModel: CityModel
  languages: Array<LanguageModel>
  languageModel: LanguageModel
} & RouteComponentProps<{ cityCode: string; languageCode: string; poiId?: string }>

const PoisPage = ({ match, cityModel, location, languages, history }: PropsType): ReactElement => {
  const { cityCode, languageCode, poiId } = match.params
  const pathname = normalizePath(location.pathname)
  const { t } = useTranslation('pois')
  const formatter = useContext(DateFormatterContext)
  const { viewportSmall } = useWindowDimensions()

  const requestPois = useCallback(async () => {
    return createPOIsEndpoint(cmsApiBaseUrl).request({ city: cityCode, language: languageCode })
  }, [cityCode, languageCode])
  const { data: pois, loading, error: poisError } = useLoadFromEndpoint(requestPois)

  const poi = poiId && pois?.find((poi: PoiModel) => poi.path === pathname)

  const toolbar = (openFeedback: (rating: FeedbackRatingType) => void) => (
    <LocationToolbar openFeedbackModal={openFeedback} viewportSmall={false} />
  )

  const languageChangePaths = languages.map(({ code, name }) => {
    const rootPath = createPath(POIS_ROUTE, { cityCode, languageCode: code })
    return {
      path: poi ? poi.availableLanguages.get(code) || null : rootPath,
      name,
      code
    }
  })

  const locationLayoutParams = {
    cityModel,
    viewportSmall,
    feedbackTargetInformation: poi ? { path: poi.path } : null,
    languageChangePaths,
    route: POIS_ROUTE,
    languageCode,
    pathname,
    toolbar
  }

  if (loading) {
    return (
      <LocationLayout isLoading {...locationLayoutParams}>
        <LoadingSpinner />
      </LocationLayout>
    )
  }

  if (!pois || (poiId && !poi)) {
    const error =
      poisError ||
      new NotFoundError({
        type: 'poi',
        id: pathname,
        city: cityCode,
        language: languageCode
      })

    return (
      <LocationLayout isLoading={false} {...locationLayoutParams}>
        <FailureSwitcher error={error} />
      </LocationLayout>
    )
  }

  if (poi) {
    const { thumbnail, lastUpdate, content, title, location } = poi
    const pageTitle = `${title} - ${cityModel.name}`

    return (
      <LocationLayout isLoading={false} {...locationLayoutParams}>
        <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} cityModel={cityModel} />
        <Page
          defaultThumbnailSrc={thumbnail}
          lastUpdate={lastUpdate}
          content={content}
          title={title}
          formatter={formatter}
          onInternalLinkClick={history.push}>
          {location.location && <PageDetail identifier={t('location')} information={location.location} />}
        </Page>
      </LocationLayout>
    )
  }
  const MapView = React.lazy(() => import('../components/MapView'))
  const sortedPois = pois.sort((poi1: PoiModel, poi2: PoiModel) => poi1.title.localeCompare(poi2.title))
  const renderPoiListItem = (poi: PoiModel) => <PoiListItem key={poi.path} poi={poi} />
  const pageTitle = `${t('app:pageTitles.pois')} - ${cityModel.name}`

  return (
    <LocationLayout isLoading={false} {...locationLayoutParams}>
      <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} cityModel={cityModel} />
      <Caption title={t('pois')} />
      <Suspense fallback>
        <MapView />
      </Suspense>
      <List noItemsMessage={t('noPois')} items={sortedPois} renderItem={renderPoiListItem} />
    </LocationLayout>
  )
}

export default PoisPage
