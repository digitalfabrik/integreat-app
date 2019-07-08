// @flow

import * as React from 'react'
import { RefreshControl, ScrollView, View } from 'react-native'
import type { TFunction } from 'react-i18next'
import {
  CATEGORIES_FEEDBACK_TYPE,
  CityModel,
  EventModel,
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

export type PropsType = {|
  events?: Array<EventModel>,
  cities: Array<CityModel>,
  cityCode?: string,
  language?: string,
  path?: string,
  resourceCache?: LanguageResourceCacheStateType,
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
    this.props.navigateToEvent({cityCode, language, path})
  }
  renderEventListItem = (cityCode: string, language: string) => (event: EventModel) => {
    const { theme } = this.props
    return <EventListItem key={event.path}
                          event={event}
                          language={language}
                          theme={theme}
                          navigateToEvent={this.navigateToEvent(cityCode, language, event.path)} />
  }

  onRefresh = () => {
    const {navigation, navigateToEvent, cityCode, language, path} = this.props
    if (cityCode && language) {
      navigateToEvent({cityCode, language, path, forceUpdate: true, key: navigation.getParam('key')})
    }
  }

  createNavigateToFeedbackForEvent = (event: EventModel) => (isPositiveFeedback: boolean) => {
    const {t, navigation, cities, cityCode} = this.props
    const cityTitle = CityModel.findCityName(cities, cityCode)
    navigation.navigate('FeedbackModal', {
      isPositiveFeedback,
      feedbackItems: [
        new FeedbackVariant(t('feedback:contentOfPage', {page: event.title}), PAGE_FEEDBACK_TYPE),
        new FeedbackVariant(t('feedback:contentOfCity', {city: cityTitle}), PAGE_FEEDBACK_TYPE),
        new FeedbackVariant(t('feedback:technicalTopics'), CATEGORIES_FEEDBACK_TYPE)
      ]
    })
  }

  navigateToFeedbackForEvents = (isPositiveFeedback: boolean) => {
    const {t, navigation, cities, cityCode} = this.props
    const cityTitle = CityModel.findCityName(cities, cityCode)
    navigation.navigate('FeedbackModal', {
      isPositiveFeedback,
      feedbackItems: [
        new FeedbackVariant(t('feedback:contentOfCity', {city: cityTitle}), PAGE_FEEDBACK_TYPE),
        new FeedbackVariant(t('feedback:technicalTopics'), CATEGORIES_FEEDBACK_TYPE)
      ]
    })
  }

  render () {
    const {events, path, cityCode, language, resourceCache, theme, navigateToIntegreatUrl, t, navigation} = this.props

    if (!events || !cityCode || !language || !resourceCache) {
      return <ScrollView refreshControl={<RefreshControl onRefresh={this.onRefresh} refreshing />} />
    }

    if (path) {
      const event: EventModel = events.find(_event => _event.path === path)

      if (event) {
        const files = resourceCache[event.path]
        return <ScrollView refreshControl={<RefreshControl onRefresh={this.onRefresh} refreshing={false} />}
                           contentContainerStyle={{flexGrow: 1}}>
          <Page content={event.content}
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
              <PageDetail identifier={t('date')} information={event.date.toFormattedString(language)} theme={theme} />
              <PageDetail identifier={t('location')} information={event.location.location} theme={theme} />
            </>
          </Page>
        </ScrollView>
      }

      const error = new ContentNotFoundError({type: 'event', id: path, city: cityCode, language})
      return <Failure error={error} />
    }

    return <ScrollView refreshControl={<RefreshControl onRefresh={this.onRefresh} refreshing={false} />}
                       contentContainerStyle={{flex: 1}}>
      <SpaceBetween>
        <View>
          <Caption title={t('news')} theme={theme} />
          <List noItemsMessage={t('currentlyNoEvents')}
                items={events}
                renderItem={this.renderEventListItem(cityCode, language)}
                theme={theme} />
        </View>
        <SiteHelpfulBox navigateToFeedback={this.navigateToFeedbackForEvents} theme={theme} t={t} />
      </SpaceBetween>
    </ScrollView>
  }
}

export default Events
