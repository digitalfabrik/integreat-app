// @flow

import * as React from 'react'
import { View } from 'react-native'
import type { TFunction } from 'react-i18next'
import {
  CATEGORIES_FEEDBACK_TYPE,
  CityModel,
  EventModel,
  EVENTS_FEEDBACK_TYPE,
  PAGE_FEEDBACK_TYPE
} from '@integreat-app/integreat-api-client'
import Page from '../../../modules/common/components/Page'
import ContentNotFoundError from '../../../modules/error/ContentNotFoundError'
import PageDetail from '../../../modules/common/components/PageDetail'
import EventListItem from './EventListItem'
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
import type { FeedbackType } from '@integreat-app/integreat-api-client/endpoints/createFeedbackEndpoint'

export type PropsType = {|
  path: ?string,
  events: Array<EventModel>,
  cities: Array<CityModel>,
  cityCode: string,
  language: string,
  resourceCache: LanguageResourceCacheStateType,
  theme: ThemeType,
  t: TFunction,
  navigation: NavigationScreenProp<*>,
  navigateToEvent: NavigateToEventParamsType => void,
  navigateToIntegreatUrl: NavigateToIntegreatUrlParamsType => void
|}

/**
 * Displays a list of events or a single event, matching the route /<location>/<language>/events(/<id>)
 */
class Events extends React.Component<PropsType> {
  navigateToEvent = (cityCode: string, language: string, path: string) => () => {
    this.props.navigateToEvent({ cityCode, language, path })
  }
  renderEventListItem = (cityCode: string, language: string) => (event: EventModel) => {
    const { theme } = this.props
    return <EventListItem key={event.path}
                          event={event}
                          language={language}
                          theme={theme}
                          navigateToEvent={this.navigateToEvent(cityCode, language, event.path)} />
  }

  createNavigateToFeedbackForEvent = (event: EventModel) => (isPositiveFeedback: boolean) => {
    const { t, navigation, cities, cityCode, language } = this.props
    const createFeedbackVariant = (label: string, feedbackType: FeedbackType, pagePath?: string): FeedbackVariant =>
      new FeedbackVariant(label, language, cityCode, feedbackType, pagePath)

    const cityTitle = CityModel.findCityName(cities, cityCode)
    navigation.navigate('FeedbackModal', {
      isPositiveFeedback,
      feedbackItems: [
        createFeedbackVariant(t('feedback:contentOfPage', { page: event.title }), PAGE_FEEDBACK_TYPE, event.path),
        createFeedbackVariant(t('feedback:contentOfCity', { city: cityTitle }), EVENTS_FEEDBACK_TYPE),
        createFeedbackVariant(t('feedback:technicalTopics'), CATEGORIES_FEEDBACK_TYPE)
      ]
    })
  }

  navigateToFeedbackForEvents = (isPositiveFeedback: boolean) => {
    const { t, navigation, cities, cityCode, language } = this.props
    const createFeedbackVariant = (label: string, feedbackType: FeedbackType, pagePath?: string) =>
      new FeedbackVariant(label, language, cityCode, feedbackType, pagePath)
    const cityTitle = CityModel.findCityName(cities, cityCode)
    navigation.navigate('FeedbackModal', {
      isPositiveFeedback,
      feedbackItems: [
        createFeedbackVariant(t('feedback:contentOfCity', { city: cityTitle }), EVENTS_FEEDBACK_TYPE),
        createFeedbackVariant(t('feedback:technicalTopics'), CATEGORIES_FEEDBACK_TYPE)
      ]
    })
  }

  render () {
    const { events, path, cityCode, language, resourceCache, theme, navigateToIntegreatUrl, t, navigation } = this.props

    if (path) {
      const event: EventModel = events.find(_event => _event.path === path)

      if (event) {
        const files = resourceCache[event.path]
        return <Page content={event.content}
                     title={event.title}
                     lastUpdate={event.lastUpdate}
                     language={language}
                     files={files}
                     t={t}
                     theme={theme}
                     cityCode={cityCode}
                     navigation={navigation}
                     navigateToIntegreatUrl={navigateToIntegreatUrl}
                     navigateToFeedback={this.createNavigateToFeedbackForEvent(event)}>
          <>
            <PageDetail identifier={t('date', { lng: language })} information={event.date.toFormattedString(language)}
                          theme={theme} language={language} />
            <PageDetail identifier={t('location', { lng: language })} information={event.location.location}
                          theme={theme} language={language} />
          </>
        </Page>
      }

      const error = new ContentNotFoundError({ type: 'event', id: path, city: cityCode, language })
      return <Failure errorMessage={error.message} t={t} theme={theme} />
    }

    return <SpaceBetween>
      <View>
        <Caption title={t('news')} theme={theme} />
        <List noItemsMessage={t('currentlyNoEvents')}
              items={events}
              renderItem={this.renderEventListItem(cityCode, language)}
              theme={theme} />
      </View>
      <SiteHelpfulBox navigateToFeedback={this.navigateToFeedbackForEvents} theme={theme} t={t} />
    </SpaceBetween>
  }
}

export default Events
