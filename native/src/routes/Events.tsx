import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { RefreshControl } from 'react-native'
import styled from 'styled-components/native'

import { CityModel, EventModel, EVENTS_ROUTE, fromError, NotFoundError, RouteInformationType } from 'api-client'

import Caption from '../components/Caption'
import EventListItem from '../components/EventListItem'
import Failure from '../components/Failure'
import { FeedbackInformationType } from '../components/FeedbackContainer'
import Layout from '../components/Layout'
import LayoutedScrollView from '../components/LayoutedScrollView'
import List from '../components/List'
import Page from '../components/Page'
import PageDetail from '../components/PageDetail'
import SiteHelpfulBox from '../components/SiteHelpfulBox'
import DateFormatterContext from '../contexts/DateFormatterContext'
import { LanguageResourceCacheStateType } from '../redux/StateType'

const Separator = styled.View`
  border-top-width: 2px;
  border-top-color: ${props => props.theme.colors.themeColor};
`

export type PropsType = {
  path: string | null | undefined
  events: Array<EventModel>
  cityModel: CityModel
  language: string
  resourceCache: LanguageResourceCacheStateType
  resourceCacheUrl: string
  navigateTo: (routeInformation: RouteInformationType) => void
  navigateToFeedback: (feedbackInformation: FeedbackInformationType) => void
  refresh: () => void
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
  refresh,
}: PropsType): ReactElement => {
  const { t } = useTranslation('events')
  const formatter = useContext(DateFormatterContext)

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
    return (
      <LayoutedScrollView refreshControl={<RefreshControl onRefresh={refresh} refreshing={false} />}>
        <Failure code={fromError(error)} />
      </LayoutedScrollView>
    )
  }

  if (path) {
    const event = events.find(_event => _event.path === path)

    if (event) {
      const files = resourceCache[event.path] || {}
      return (
        <LayoutedScrollView refreshControl={<RefreshControl onRefresh={refresh} refreshing={false} />}>
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
                language={language}
              />
              {event.location && (
                <PageDetail identifier={t('address')} information={event.location.fullAddress} language={language} />
              )}
            </>
          </Page>
        </LayoutedScrollView>
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

  const renderEventListItem = ({ item }: { item: EventModel }) => {
    const navigateToEvent = () =>
      navigateTo({
        route: EVENTS_ROUTE,
        cityCode: cityModel.code,
        languageCode: language,
        cityContentPath: item.path,
      })
    return (
      <EventListItem
        key={item.path}
        formatter={formatter}
        event={item}
        language={language}
        navigateToEvent={navigateToEvent}
      />
    )
  }

  return (
    <Layout>
      <List
        items={events}
        renderItem={renderEventListItem}
        Header={
          <>
            <Caption title={t('events')} />
            <Separator />
          </>
        }
        Footer={<SiteHelpfulBox navigateToFeedback={navigateToFeedbackForEvents} />}
        refresh={refresh}
        noItemsMessage={t('currentlyNoEvents')}
      />
    </Layout>
  )
}

export default Events
