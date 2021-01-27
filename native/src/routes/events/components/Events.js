// @flow

import * as React from 'react'
import { useContext, useCallback } from 'react'
import { View } from 'react-native'
import type { TFunction } from 'react-i18next'
import {
  EventModel,
  NotFoundError
} from 'api-client'
import Page from '../../../modules/common/components/Page'
import PageDetail from '../../../modules/common/components/PageDetail'
import EventListItem from './EventListItem'
import List from '../../../modules/common/components/List'
import Caption from '../../../modules/common/components/Caption'
import Failure from '../../../modules/error/components/Failure'
import type { ThemeType } from 'build-configs/ThemeType'
import type { LanguageResourceCacheStateType } from '../../../modules/app/StateType'
import type { NavigateToEventParamsType } from '../../../modules/app/createNavigateToEvent'
import SiteHelpfulBox from '../../../modules/common/components/SiteHelpfulBox'
import SpaceBetween from '../../../modules/common/components/SpaceBetween'
import ErrorCodes from '../../../modules/error/ErrorCodes'
import type { FeedbackInformationType } from '../../feedback/containers/FeedbackModalContainer'
import DateFormatterContext from '../../../modules/i18n/context/DateFormatterContext'

export type PropsType = {|
  path: ?string,
  events: Array<EventModel>,
  cityCode: string,
  language: string,
  resourceCache: LanguageResourceCacheStateType,
  resourceCacheUrl: string,
  theme: ThemeType,
  t: TFunction,
  navigateToEvent: NavigateToEventParamsType => void,
  navigateToFeedback: FeedbackInformationType => void,
  navigateToLink: (url: string, language: string, shareUrl: string) => void
|}

/**
 * Displays a list of events or a single event, matching the route /<location>/<language>/events(/<id>)
 */
const Events = ({
  cityCode,
  language,
  theme,
  navigateToEvent,
  events,
  path,
  resourceCache,
  resourceCacheUrl,
  t,
  navigateToLink,
  navigateToFeedback
}: PropsType) => {
  const formatter = useContext(DateFormatterContext)

  const renderEventListItem = (cityCode: string, language: string) => (event: EventModel) => {
    return <EventListItem key={event.path}
                          event={event}
                          cityCode={cityCode}
                          language={language}
                          theme={theme}
                          navigateToEvent={navigateToEvent} />
  }

  const createNavigateToFeedbackForEvent = (event: EventModel) => (isPositiveFeedback: boolean) => {
    navigateToFeedback({
      type: 'Event',
      title: event.title,
      path: event.path,
      cityCode,
      language,
      isPositiveFeedback
    })
  }

  const navigateToFeedbackForEvents = useCallback((isPositiveFeedback: boolean) => {
    navigateToFeedback({
      type: 'Event',
      cityCode,
      language,
      isPositiveFeedback
    })
  }, [navigateToFeedback, cityCode, language])

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
                   navigateToLink={navigateToLink}
                   navigateToFeedback={createNavigateToFeedbackForEvent(event)}>
        <>
          <PageDetail identifier={t('date')} information={event.date.toFormattedString(formatter)}
                      theme={theme} language={language} />
          {location && <PageDetail identifier={t('location')} information={location} theme={theme}
                                   language={language} />}
        </>
      </Page>
    }

    const error = new NotFoundError({
      type: 'event',
      id: path,
      city: cityCode,
      language
    })
    return <Failure errorMessage={error.message} code={ErrorCodes.PageNotFound} t={t} theme={theme} />
  }

  return <SpaceBetween>
    <View>
      <Caption title={t('events')} theme={theme} />
      <List noItemsMessage={t('currentlyNoEvents')}
            items={events}
            renderItem={renderEventListItem(cityCode, language)}
            theme={theme} />
    </View>
    <SiteHelpfulBox navigateToFeedback={navigateToFeedbackForEvents} theme={theme} t={t} />
  </SpaceBetween>
}

export default Events
