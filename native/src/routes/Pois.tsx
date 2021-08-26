import React, { ReactElement, ReactNode } from 'react'
import { View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { CityModel, fromError, NotFoundError, PoiModel, POIS_ROUTE, RouteInformationType } from 'api-client'
import Page from '../components/Page'
import PageDetail from '../components/PageDetail'
import List from '../components/List'
import Caption from '../components/Caption'
import { LanguageResourceCacheStateType } from '../redux/StateType'
import SiteHelpfulBox from '../components/SiteHelpfulBox'
import SpaceBetween from '../components/SpaceBetween'
import PoiListItem from '../components/PoiListItem'
import { FeedbackInformationType } from '../components/FeedbackContainer'
import MapView from '../components/MapView'
import { useTheme } from 'styled-components'
import FailureContainer from '../components/FailureContainer'

export type PropsType = {
  path: string | null | undefined
  pois: Array<PoiModel>
  cityModel: CityModel
  language: string
  resourceCache: LanguageResourceCacheStateType
  resourceCacheUrl: string
  navigateTo: (arg0: RouteInformationType) => void
  navigateToFeedback: (arg0: FeedbackInformationType) => void
  navigateToLink: (url: string, language: string, shareUrl: string) => void
}

/**
 * Displays a list of pois or a single poi, matching the route /<location>/<language>/pois(/<id>)
 * cityCode: string, language: string, path: ?string, key?: string, forceRefresh?: boolean
 */

const Pois = ({
  pois,
  language,
  path,
  cityModel,
  resourceCache,
  resourceCacheUrl,
  navigateTo,
  navigateToFeedback,
  navigateToLink
}: PropsType): ReactElement => {
  const { t } = useTranslation('pois')
  const theme = useTheme()

  const navigateToPois = (cityCode: string, language: string, path: string) => (): void => {
    navigateTo({
      route: POIS_ROUTE,
      cityCode,
      languageCode: language,
      cityContentPath: path
    })
  }

  const renderPoiListItem = (cityCode: string, language: string) => (poi: PoiModel): ReactNode => {
    return (
      <PoiListItem
        key={poi.path}
        poi={poi}
        language={language}
        theme={theme}
        navigateToPois={navigateToPois(cityCode, language, poi.path)}
      />
    )
  }

  const createNavigateToFeedbackForPoi = (poi: PoiModel) => (isPositiveFeedback: boolean): void => {
    navigateToFeedback({
      routeType: POIS_ROUTE,
      language,
      path: poi.path,
      cityCode: cityModel.code,
      isPositiveFeedback
    })
  }

  const navigateToFeedbackForPois = (isPositiveFeedback: boolean) => {
    navigateToFeedback({
      routeType: POIS_ROUTE,
      language,
      cityCode: cityModel.code,
      isPositiveFeedback
    })
  }

  const sortedPois = pois.sort((poi1, poi2) => poi1.title.localeCompare(poi2.title))

  if (path) {
    const poi = sortedPois.find(_poi => _poi.path === path)

    if (poi) {
      const location = poi.location.location
      const files = resourceCache[poi.path] || {}
      return (
        <Page
          content={poi.content}
          title={poi.title}
          lastUpdate={poi.lastUpdate}
          language={language}
          files={files}
          theme={theme}
          resourceCacheUrl={resourceCacheUrl}
          navigateToLink={navigateToLink}
          navigateToFeedback={createNavigateToFeedbackForPoi(poi)}>
          <>
            {location && (
              <PageDetail identifier={t('location')} information={location} theme={theme} language={language} />
            )}
          </>
        </Page>
      )
    }

    const error = new NotFoundError({
      type: 'poi',
      id: path,
      city: cityModel.code,
      language
    })
    return <FailureContainer code={fromError(error)} />
  }

  return (
    <SpaceBetween>
      <View>
        <Caption title={t('poi')} theme={theme} />
        {cityModel.boundingBox && <MapView boundingBox={cityModel.boundingBox} />}
        <List
          noItemsMessage={t('currentlyNoPois')}
          items={sortedPois}
          renderItem={renderPoiListItem(cityModel.code, language)}
          theme={theme}
        />
      </View>
      <SiteHelpfulBox navigateToFeedback={navigateToFeedbackForPois} theme={theme} />
    </SpaceBetween>
  )
}

export default Pois
