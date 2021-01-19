// @flow

import * as React from 'react'
import { View } from 'react-native'
import type { TFunction } from 'react-i18next'
import {
  CityModel,
  PoiModel,
  NotFoundError
} from 'api-client'
import Page from '../../../modules/common/components/Page'
import PageDetail from '../../../modules/common/components/PageDetail'
import List from '../../../modules/common/components/List'
import Caption from '../../../modules/common/components/Caption'
import Failure from '../../../modules/error/components/Failure'
import type { ThemeType } from '../../../modules/theme/constants'
import type { LanguageResourceCacheStateType } from '../../../modules/app/StateType'
import SiteHelpfulBox from '../../../modules/common/components/SiteHelpfulBox'
import SpaceBetween from '../../../modules/common/components/SpaceBetween'
import ErrorCodes from '../../../modules/error/ErrorCodes'
import PoiListItem from './PoiListItem'
import type { NavigateToPoiParamsType } from '../../../modules/app/createNavigateToPoi'
import type { FeedbackInformationType } from '../../feedback/containers/FeedbackModalContainer'

export type PropsType = {|
  path: ?string,
  pois: Array<PoiModel>,
  cities: Array<CityModel>,
  cityCode: string,
  language: string,
  resourceCache: LanguageResourceCacheStateType,
  resourceCacheUrl: string,
  theme: ThemeType,
  t: TFunction,
  navigateToPoi: NavigateToPoiParamsType => void,
  navigateToFeedback: FeedbackInformationType => void,
  navigateToLink: (url: string, language: string, shareUrl: string) => void
|}

/**
 * Displays a list of pois or a single poi, matching the route /<location>/<language>/pois(/<id>)
 * cityCode: string, language: string, path: ?string, key?: string, forceRefresh?: boolean
 */
class Pois extends React.Component<PropsType> {
  navigateToPoi = (cityCode: string, language: string, path: string) => () => {
    this.props.navigateToPoi({ cityCode, language, path })
  }

  renderPoiListItem = (cityCode: string, language: string) => (poi: PoiModel) => {
    const { theme } = this.props
    return <PoiListItem key={poi.path}
                          poi={poi}
                          language={language}
                          theme={theme}
                          navigateToPoi={this.navigateToPoi(cityCode, language, poi.path)} />
  }

  createNavigateToFeedbackForPoi = (poi: PoiModel) => (isPositiveFeedback: boolean) => {
    const { navigateToFeedback, cityCode, language } = this.props

    navigateToFeedback({
      type: 'Pois',
      language,
      title: poi.title,
      cityCode,
      isPositiveFeedback
    })
  }

  navigateToFeedbackForPois = (isPositiveFeedback: boolean) => {
    const { navigateToFeedback, cityCode, language } = this.props

    navigateToFeedback({
      type: 'Pois',
      language,
      cityCode,
      isPositiveFeedback
    })
  }

  render () {
    const { pois, path, cityCode, language, resourceCache, resourceCacheUrl, theme, navigateToLink, t } = this.props

    const sortedPois = pois.sort((poi1, poi2) => poi1.title.localeCompare(poi2.title))
    if (path) {
      const poi: ?PoiModel = sortedPois.find(_poi => _poi.path === path)
      if (poi) {
        const location = poi.location.location
        const files = resourceCache[poi.path] || {}
        return <Page content={poi.content}
                     title={poi.title}
                     lastUpdate={poi.lastUpdate}
                     language={language}
                     files={files}
                     theme={theme}
                     resourceCacheUrl={resourceCacheUrl}
                     navigateToLink={navigateToLink}
                     navigateToFeedback={this.createNavigateToFeedbackForPoi(poi)}>
          <>
            {location && <PageDetail identifier={t('location')}
                                                    information={location} theme={theme}
                                                    language={language} />}
          </>
        </Page>
      }

      const error = new NotFoundError({ type: 'poi', id: path, city: cityCode, language })
      return <Failure errorMessage={error.message} code={ErrorCodes.PageNotFound} t={t} theme={theme} />
    }

    return <SpaceBetween>
      <View>
        <Caption title={t('poi')} theme={theme} />
        <List noItemsMessage={t('currentlyNoPois')}
              items={sortedPois}
              renderItem={this.renderPoiListItem(cityCode, language)}
              theme={theme} />
      </View>
      <SiteHelpfulBox navigateToFeedback={this.navigateToFeedbackForPois} theme={theme} t={t} />
    </SpaceBetween>
  }
}

export default Pois
