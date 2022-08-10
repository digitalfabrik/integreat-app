import * as React from 'react'
import { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { useTheme } from 'styled-components'

import { CityModel, EventModel, EVENTS_ROUTE, fromError, NotFoundError, RouteInformationType } from 'api-client'

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
  navigateTo: (arg0: RouteInformationType) => void
  navigateToFeedback: (arg0: FeedbackInformationType) => void
}

/**
 * Displays a list of events or a single event, matching the route /<location>/<language>/events(/<id>)
 */
const Events = ({
  cityModel,
  language,
  navigateTo,
  events,
  path,
  resourceCache,
  resourceCacheUrl,
  navigateToFeedback,
}: PropsType): ReactElement => {
  const { t } = useTranslation('events')
  const theme = useTheme()
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
      isPositiveFeedback,
    })
  }

  const navigateToFeedbackForEvents = (isPositiveFeedback: boolean) => {
    navigateToFeedback({
      routeType: EVENTS_ROUTE,
      cityCode: cityModel.code,
      language,
      isPositiveFeedback,
    })
  }

  if (!cityModel.eventsEnabled) {
    const error = new NotFoundError({
      type: 'category',
      id: 'events',
      city: cityModel.code,
      language,
    })
    return <Failure code={fromError(error)} />
  }

  if (path) {
    const event = events.find(_event => _event.path === path)

    if (event) {
      const files = resourceCache[event.path] || {}
      return (
        <Page
          content={event.content}
          title={event.title}
          lastUpdate={event.lastUpdate}
          language={language}
          files={files}
          resourceCacheUrl={resourceCacheUrl}
          navigateToFeedback={createNavigateToFeedbackForEvent(event)}>
          <>
            <PageDetail
              identifier={t('date')}
              information={event.date.toFormattedString(formatter)}
              theme={theme}
              language={language}
            />
            {event.location && (
              <PageDetail
                identifier={t('address')}
                information={event.location.fullAddress}
                theme={theme}
                language={language}
              />
            )}
          </>
        </Page>
      )
    }

    const error = new NotFoundError({
      type: 'event',
      id: path,
      city: cityModel.code,
      language,
    })
    return <Failure code={fromError(error)} />
  }

  return (
    <SpaceBetween>
      <View>
        <Caption title={t('events')} />
        <List noItemsMessage={t('currentlyNoEvents')} items={events} renderItem={renderEventListItem} />
      </View>
      <SiteHelpfulBox navigateToFeedback={navigateToFeedbackForEvents} />
    </SpaceBetween>
  )
}

export default Events
