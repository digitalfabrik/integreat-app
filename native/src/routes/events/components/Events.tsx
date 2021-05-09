// @flow

import * as React from 'react'
import { useContext } from 'react'
import { View } from 'react-native'
import type { TFunction } from 'react-i18next'
import { CityModel, EventModel, EVENTS_ROUTE, NotFoundError } from 'api-client'
import Page from '../../../modules/common/components/Page'
import PageDetail from '../../../modules/common/components/PageDetail'
import EventListItem from './EventListItem'
import List from '../../../modules/common/components/List'
import Caption from '../../../modules/common/components/Caption'
import type { ThemeType } from 'build-configs/ThemeType'
import type { LanguageResourceCacheStateType } from '../../../modules/app/StateType'
import SiteHelpfulBox from '../../../modules/common/components/SiteHelpfulBox'
import SpaceBetween from '../../../modules/common/components/SpaceBetween'
import { fromError } from '../../../modules/error/ErrorCodes'
import type { FeedbackInformationType } from '../../../modules/feedback/FeedbackContainer'
import DateFormatterContext from '../../../modules/i18n/context/DateFormatterContext'
import type { RouteInformationType } from 'api-client/src/routes/RouteInformationTypes'
import FailureContainer from '../../../modules/error/containers/FailureContainer'

export type PropsType = {|
  path: ?string,
  events: Array<EventModel>,
  cityModel: CityModel,
  language: string,
  resourceCache: LanguageResourceCacheStateType,
  resourceCacheUrl: string,
  theme: ThemeType,
  t: TFunction,
  navigateTo: RouteInformationType => void,
  navigateToFeedback: FeedbackInformationType => void,
  navigateToLink: (url: string, language: string, shareUrl: string) => void
|}

/**
 * Displays a list of events or a single event, matching the route /<location>/<language>/events(/<id>)
 */
const Events = ({
  cityModel,
  language,
  theme,
  navigateTo,
  events,
  path,
  resourceCache,
  resourceCacheUrl,
  t,
  navigateToLink,
  navigateToFeedback
}: PropsType) => {
  const formatter = useContext(DateFormatterContext)

  const renderEventListItem = (event: EventModel) => {
    return (
      <EventListItem
        key={event.path}
        event={event}
        cityCode={cityModel.code}
        language={language}
        theme={theme}
        navigateTo={navigateTo}
      />
    )
  }

  const createNavigateToFeedbackForEvent = (event: EventModel) => (isPositiveFeedback: boolean) => {
    navigateToFeedback({
      routeType: EVENTS_ROUTE,
      path: event.path,
      cityCode: cityModel.code,
      language,
      isPositiveFeedback
    })
  }

  const navigateToFeedbackForEvents = (isPositiveFeedback: boolean) => {
    navigateToFeedback({
      routeType: EVENTS_ROUTE,
      cityCode: cityModel.code,
      language,
      isPositiveFeedback
    })
  }

  if (!cityModel.eventsEnabled) {
    const error = new NotFoundError({ type: 'category', id: 'events', city: cityModel.code, language })
    return <FailureContainer code={fromError(error)} />
  }

  if (path) {
    const event: ?EventModel = events.find(_event => _event.path === path)

    if (event) {
      const location = event.location.location
      const files = resourceCache[event.path] || {}
      return (
        <Page
          content={event.content}
          title={event.title}
          lastUpdate={event.lastUpdate}
          language={language}
          files={files}
          theme={theme}
          resourceCacheUrl={resourceCacheUrl}
          navigateToLink={navigateToLink}
          navigateToFeedback={createNavigateToFeedbackForEvent(event)}>
          <>
            <PageDetail
              identifier={t('date')}
              information={event.date.toFormattedString(formatter)}
              theme={theme}
              language={language}
            />
            {location && (
              <PageDetail identifier={t('location')} information={location} theme={theme} language={language} />
            )}
          </>
        </Page>
      )
    }

    const error = new NotFoundError({ type: 'event', id: path, city: cityModel.code, language })
    return <FailureContainer code={fromError(error)} />
  }

  return (
    <SpaceBetween>
      <View>
        <Caption title={t('events')} theme={theme} />
        <List noItemsMessage={t('currentlyNoEvents')} items={events} renderItem={renderEventListItem} theme={theme} />
      </View>
      <SiteHelpfulBox navigateToFeedback={navigateToFeedbackForEvents} theme={theme} />
    </SpaceBetween>
  )
}

export default Events
