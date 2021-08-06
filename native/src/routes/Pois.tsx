import * as React from 'react'
import { View } from 'react-native'
import { TFunction } from 'react-i18next'
import { fromError, PoiModel, NotFoundError, POIS_ROUTE, RouteInformationType } from 'api-client'
import Page from '../components/Page'
import PageDetail from '../components/PageDetail'
import List from '../components/List'
import Caption from '../components/Caption'
import Failure from '../components/Failure'
import { ThemeType } from 'build-configs'
import { LanguageResourceCacheStateType } from '../redux/StateType'
import SiteHelpfulBox from '../components/SiteHelpfulBox'
import SpaceBetween from '../components/SpaceBetween'
import PoiListItem from '../components/PoiListItem'
import { FeedbackInformationType } from '../components/FeedbackContainer'
import { ReactNode } from 'react'
import MapView from '../components/MapView'

export type PropsType = {
  path: string | null | undefined
  pois: Array<PoiModel>
  cityCode: string
  language: string
  resourceCache: LanguageResourceCacheStateType
  resourceCacheUrl: string
  theme: ThemeType
  t: TFunction
  navigateTo: (arg0: RouteInformationType) => void
  navigateToFeedback: (arg0: FeedbackInformationType) => void
  navigateToLink: (url: string, language: string, shareUrl: string) => void
}

/**
 * Displays a list of pois or a single poi, matching the route /<location>/<language>/pois(/<id>)
 * cityCode: string, language: string, path: ?string, key?: string, forceRefresh?: boolean
 */

class Pois extends React.Component<PropsType> {
  navigateToPois = (cityCode: string, language: string, path: string) => (): void => {
    this.props.navigateTo({
      route: POIS_ROUTE,
      cityCode,
      languageCode: language,
      cityContentPath: path
    })
  }

  renderPoiListItem = (cityCode: string, language: string) => (poi: PoiModel): ReactNode => {
    const { theme } = this.props
    return (
      <PoiListItem
        key={poi.path}
        poi={poi}
        language={language}
        theme={theme}
        navigateToPois={this.navigateToPois(cityCode, language, poi.path)}
      />
    )
  }

  createNavigateToFeedbackForPoi = (poi: PoiModel) => (isPositiveFeedback: boolean): void => {
    const { navigateToFeedback, cityCode, language } = this.props
    navigateToFeedback({
      routeType: POIS_ROUTE,
      language,
      path: poi.path,
      cityCode,
      isPositiveFeedback
    })
  }

  navigateToFeedbackForPois = (isPositiveFeedback: boolean): void => {
    const { navigateToFeedback, cityCode, language } = this.props
    navigateToFeedback({
      routeType: POIS_ROUTE,
      language,
      cityCode,
      isPositiveFeedback
    })
  }

  render(): ReactNode {
    const { pois, path, cityCode, language, resourceCache, resourceCacheUrl, theme, navigateToLink, t } = this.props
    const sortedPois = pois.sort((poi1, poi2) => poi1.title.localeCompare(poi2.title))

    if (path) {
      const poi: PoiModel | null | undefined = sortedPois.find(_poi => _poi.path === path)

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
            navigateToFeedback={this.createNavigateToFeedbackForPoi(poi)}>
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
        city: cityCode,
        language
      })
      return <Failure code={fromError(error)} t={t} theme={theme} />
    }

    return (
      <SpaceBetween>
        <View>
          <Caption title={t('poi')} theme={theme} />
          <MapView />
          <List
            noItemsMessage={t('currentlyNoPois')}
            items={sortedPois}
            renderItem={this.renderPoiListItem(cityCode, language)}
            theme={theme}
          />
        </View>
        <SiteHelpfulBox navigateToFeedback={this.navigateToFeedbackForPois} theme={theme} />
      </SpaceBetween>
    )
  }
}

export default Pois
