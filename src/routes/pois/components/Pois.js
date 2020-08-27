// @flow

import * as React from 'react'
import { View } from 'react-native'
import type { TFunction } from 'react-i18next'
import {
  CATEGORIES_FEEDBACK_TYPE,
  CityModel,
  CONTENT_FEEDBACK_CATEGORY,
  PoiModel,
  EVENTS_FEEDBACK_TYPE,
  PAGE_FEEDBACK_TYPE,
  TECHNICAL_FEEDBACK_CATEGORY
} from '@integreat-app/integreat-api-client'
import Page from '../../../modules/common/components/Page'
import ContentNotFoundError from '../../../modules/error/ContentNotFoundError'
import PageDetail from '../../../modules/common/components/PageDetail'
import List from '../../../modules/common/components/List'
import Caption from '../../../modules/common/components/Caption'
import Failure from '../../../modules/error/components/Failure'
import type { ThemeType } from '../../../modules/theme/constants/theme'
import type { LanguageResourceCacheStateType } from '../../../modules/app/StateType'
import type { NavigationScreenProp } from 'react-navigation'
import type { NavigateToEventParamsType } from '../../../modules/app/createNavigateToEvent'
import type { NavigateToIntegreatUrlParamsType } from '../../../modules/app/createNavigateToIntegreatUrl'
import FeedbackVariant from '../../feedback/FeedbackVariant'
import SiteHelpfulBox from '../../../modules/common/components/SiteHelpfulBox'
import SpaceBetween from '../../../modules/common/components/SpaceBetween'
import type {
  FeedbackCategoryType,
  FeedbackType
} from '@integreat-app/integreat-api-client/endpoints/createFeedbackEndpoint'
import ErrorCodes from '../../../modules/error/ErrorCodes'
import PoiListItem from './PoiListItem'
import type { NavigateToPoiParamsType } from '../../../modules/app/createNavigateToPoi'

export type PropsType = {|
  path: ?string,
  pois: Array<PoiModel>,
  cities: Array<CityModel>,
  cityCode: string,
  language: string,
  resourceCache: LanguageResourceCacheStateType,
  theme: ThemeType,
  t: TFunction,
  navigation: NavigationScreenProp<*>,
  navigateToPoi: NavigateToPoiParamsType => void,
  navigateToIntegreatUrl: NavigateToIntegreatUrlParamsType => void
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
    const { t, navigation, cities, cityCode, language } = this.props

    const createFeedbackVariant = (
      label: string, feedbackType: FeedbackType, feedbackCategory: FeedbackCategoryType, pagePath?: string
    ): FeedbackVariant => new FeedbackVariant(label, language, cityCode, feedbackType, feedbackCategory, pagePath)

    const cityTitle = CityModel.findCityName(cities, cityCode)
    navigation.navigate('FeedbackModal', {
      isPositiveFeedback,
      feedbackItems: [
        createFeedbackVariant(t('feedback:contentOfPoi', { poi: poi.title }), PAGE_FEEDBACK_TYPE,
          CONTENT_FEEDBACK_CATEGORY, poi.path),
        createFeedbackVariant(t('feedback:contentOfCity', { city: cityTitle }), EVENTS_FEEDBACK_TYPE,
          CONTENT_FEEDBACK_CATEGORY),
        createFeedbackVariant(t('feedback:technicalTopics'), CATEGORIES_FEEDBACK_TYPE, TECHNICAL_FEEDBACK_CATEGORY)
      ]
    })
  }

  navigateToFeedbackForPois = (isPositiveFeedback: boolean) => {
    const { t, navigation, cities, cityCode, language } = this.props
    const createFeedbackVariant = (label: string, feedbackType: FeedbackType, feedbackCategory: FeedbackCategoryType,
      pagePath?: string) =>
      new FeedbackVariant(label, language, cityCode, feedbackType, feedbackCategory, pagePath)
    const cityTitle = CityModel.findCityName(cities, cityCode)
    navigation.navigate('FeedbackModal', {
      isPositiveFeedback,
      feedbackItems: [
        createFeedbackVariant(t('feedback:contentOfCity', { city: cityTitle }), EVENTS_FEEDBACK_TYPE,
          CONTENT_FEEDBACK_CATEGORY),
        createFeedbackVariant(t('feedback:technicalTopics'), CATEGORIES_FEEDBACK_TYPE, TECHNICAL_FEEDBACK_CATEGORY)
      ]
    })
  }

  render () {
    const { pois, path, cityCode, language, resourceCache, theme, navigateToIntegreatUrl, t, navigation } = this.props
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
                     cityCode={cityCode}
                     navigation={navigation}
                     navigateToIntegreatUrl={navigateToIntegreatUrl}
                     navigateToFeedback={this.createNavigateToFeedbackForPoi(poi)}>
          <>
            {location && <PageDetail identifier={t('location')}
                                                    information={location} theme={theme}
                                                    language={language} />}
          </>
        </Page>
      }

      const error = new ContentNotFoundError({ type: 'poi', id: path, city: cityCode, language })
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
