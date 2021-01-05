// @flow

import * as React from 'react'
import { View } from 'react-native'
import type { TFunction } from 'react-i18next'
import {
  CityModel,
  EventModel,
  NotFoundError
} from 'api-client'
import Page from '../../../modules/common/components/Page'
import PageDetail from '../../../modules/common/components/PageDetail'
import EventListItem from './EventListItem'
import List from '../../../modules/common/components/List'
import Caption from '../../../modules/common/components/Caption'
import Failure from '../../../modules/error/components/Failure'
import type { ThemeType } from '../../../modules/theme/constants'
import type { LanguageResourceCacheStateType } from '../../../modules/app/StateType'
import type { NavigationStackProp } from 'react-navigation-stack'
import type { NavigateToEventParamsType } from '../../../modules/app/createNavigateToEvent'
import type { NavigateToInternalLinkParamsType } from '../../../modules/app/createNavigateToInternalLink'
import SiteHelpfulBox from '../../../modules/common/components/SiteHelpfulBox'
import SpaceBetween from '../../../modules/common/components/SpaceBetween'
import ErrorCodes from '../../../modules/error/ErrorCodes'
import createNavigateToFeedbackModal from '../../../modules/app/createNavigateToFeedbackModal'

export type PropsType = {|
  path: ?string,
  events: Array<EventModel>,
  cities: Array<CityModel>,
  cityCode: string,
  language: string,
  resourceCache: LanguageResourceCacheStateType,
  resourceCacheUrl: string,
  theme: ThemeType,
  t: TFunction,
  navigation: NavigationStackProp<*>,
  navigateToEvent: NavigateToEventParamsType => void,
  navigateToInternalLink: NavigateToInternalLinkParamsType => void
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
    const { navigation, cityCode, language } = this.props

    createNavigateToFeedbackModal(navigation)({
      type: 'Event',
      title: event.title,
      path: event.path,
      cityCode,
      language,
      isPositiveFeedback
    })
  }

  navigateToFeedbackForEvents = (isPositiveFeedback: boolean) => {
    const { navigation, cityCode, language } = this.props

    createNavigateToFeedbackModal(navigation)({
      type: 'Event',
      cityCode,
      language,
      isPositiveFeedback
    })
  }

  render () {
    const {
      events, path, cityCode, language, resourceCache, resourceCacheUrl, theme, navigateToInternalLink, t, navigation
    } = this.props

    if (path) {
      const event: ?EventModel = events.find(_event => _event.path === path)

      if (event) {
        const location = event.location.location
        const files = resourceCache[event.path] || {}
        return <Page content={event.content}
                     title={event.title}
                     lastUpdate={event.lastUpdate}
                     language={language}
                     files={files}
                     theme={theme}
                     resourceCacheUrl={resourceCacheUrl}
                     navigation={navigation}
                     navigateToInternalLink={navigateToInternalLink}
                     navigateToFeedback={this.createNavigateToFeedbackForEvent(event)}>
          <>
            <PageDetail identifier={t('date')} information={event.date.toFormattedString(language)}
                        theme={theme} language={language} />
            {location && <PageDetail identifier={t('location')} information={location} theme={theme}
                                     language={language} />}
          </>
        </Page>
      }

      const error = new NotFoundError({ type: 'event', id: path, city: cityCode, language })
      return <Failure errorMessage={error.message} code={ErrorCodes.PageNotFound} t={t} theme={theme} />
    }

    return <SpaceBetween>
      <View>
        <Caption title={t('events')} theme={theme} />
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
