import * as React from 'react'
import { ReactElement, useContext } from 'react'
import { TFunction } from 'react-i18next'
import { View } from 'react-native'

import { CityModel, EventModel, EVENTS_ROUTE, fromError, NotFoundError, RouteInformationType } from 'api-client'
import { ThemeType } from 'build-configs'

import Caption from '../components/Caption'
import EventListItem from '../components/EventListItem'
import Failure from '../components/Failure'
import { FeedbackInformationType } from '../components/FeedbackContainer'
import List from '../components/List'
import Page from '../components/Page'
import PageDetail from '../components/PageDetail'
import SiteHelpfulBox from '../components/SiteHelpfulBox'
import SpaceBetween from '../components/SpaceBetween'
import DateFormatterContext from '../contexts/DateFormatterContext'
import { LanguageResourceCacheStateType } from '../redux/StateType'

export type PropsType = {
  path: string | null | undefined
  events: Array<EventModel>
  cityModel: CityModel
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
}: PropsType): ReactElement => {
  const formatter = useContext(DateFormatterContext)

  const renderEventListItem = (event: EventModel) => (
    <EventListItem
      key={event.path}
      event={event}
      cityCode={cityModel.code}
      language={language}
      theme={theme}
      navigateTo={navigateTo}
    />
  )

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
    const error = new NotFoundError({
      type: 'category',
      id: 'events',
      city: cityModel.code,
      language
    })
    return <Failure code={fromError(error)} />
  }

  if (path) {
    const event: EventModel | null | undefined = events.find(_event => _event.path === path)

    if (event) {
      const { location } = event.location
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

    const error = new NotFoundError({
      type: 'event',
      id: path,
      city: cityModel.code,
      language
    })
    return <Failure code={fromError(error)} />
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
