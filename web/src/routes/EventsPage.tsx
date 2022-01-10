import React, { ReactElement, useCallback, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

import {
  createEventsEndpoint,
  EventModel,
  EVENTS_ROUTE,
  normalizePath,
  NotFoundError,
  useLoadFromEndpoint
} from 'api-client'

import { CityRouteProps } from '../CityContentSwitcher'
import Caption from '../components/Caption'
import EventListItem from '../components/EventListItem'
import FailureSwitcher from '../components/FailureSwitcher'
import { FeedbackRatingType } from '../components/FeedbackToolbarItem'
import Helmet from '../components/Helmet'
import JsonLdEvent from '../components/JsonLdEvent'
import List from '../components/List'
import LoadingSpinner from '../components/LoadingSpinner'
import LocationLayout from '../components/LocationLayout'
import LocationToolbar from '../components/LocationToolbar'
import Page, { THUMBNAIL_WIDTH } from '../components/Page'
import PageDetail from '../components/PageDetail'
import { cmsApiBaseUrl } from '../constants/urls'
import DateFormatterContext from '../contexts/DateFormatterContext'
import useWindowDimensions from '../hooks/useWindowDimensions'
import featuredImageToSrcSet from '../utils/featuredImageToSrcSet'
import { createPath, RouteProps } from './index'

type PropsType = CityRouteProps & RouteProps<typeof EVENTS_ROUTE>

const EventsPage = ({ cityModel, match, location, languages }: PropsType): ReactElement => {
  const { cityCode, languageCode, eventId } = match.params
  const pathname = normalizePath(location.pathname)
  const history = useHistory()
  const { t } = useTranslation('events')
  const formatter = useContext(DateFormatterContext)
  const { viewportSmall } = useWindowDimensions()

  const requestEvents = useCallback(
    async () => createEventsEndpoint(cmsApiBaseUrl).request({ city: cityCode, language: languageCode }),
    [cityCode, languageCode]
  )
  const { data: events, loading, error: eventsError } = useLoadFromEndpoint(requestEvents)

  const event = eventId ? events?.find((event: EventModel) => event.path === pathname) : null

  const toolbar = (openFeedback: (rating: FeedbackRatingType) => void) => (
    <LocationToolbar openFeedbackModal={openFeedback} viewportSmall={viewportSmall} />
  )

  const languageChangePaths = languages.map(({ code, name }) => {
    const isCurrentLanguage = code === languageCode
    const path = event
      ? event.availableLanguages.get(code) || null
      : createPath(EVENTS_ROUTE, { cityCode, languageCode: code })

    return {
      path: isCurrentLanguage ? pathname : path,
      name,
      code
    }
  })

  const locationLayoutParams = {
    cityModel,
    viewportSmall,
    feedbackTargetInformation: event ? { path: event.path } : null,
    languageChangePaths,
    route: EVENTS_ROUTE,
    languageCode,
    toolbar
  }

  if (loading) {
    return (
      <LocationLayout isLoading {...locationLayoutParams}>
        <LoadingSpinner />
      </LocationLayout>
    )
  }

  if (!events || (eventId && !event)) {
    const error =
      eventsError ||
      new NotFoundError({
        type: 'event',
        id: pathname,
        city: cityCode,
        language: languageCode
      })

    return (
      <LocationLayout isLoading={false} {...locationLayoutParams}>
        <FailureSwitcher error={error} />
      </LocationLayout>
    )
  }

  if (event) {
    const { featuredImage, thumbnail, lastUpdate, content, title, location, date } = event
    const defaultThumbnail = featuredImage ? featuredImage.medium.url : thumbnail
    const pageTitle = `${event.title} - ${cityModel.name}`

    return (
      <LocationLayout isLoading={false} {...locationLayoutParams}>
        <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} cityModel={cityModel} />
        <JsonLdEvent event={event} formatter={formatter} />
        <Page
          defaultThumbnailSrc={defaultThumbnail}
          thumbnailSrcSet={featuredImage ? featuredImageToSrcSet(featuredImage, THUMBNAIL_WIDTH) : undefined}
          lastUpdate={lastUpdate}
          content={content}
          title={title}
          formatter={formatter}
          onInternalLinkClick={history.push}>
          <>
            <PageDetail identifier={t('date')} information={date.toFormattedString(formatter)} />
            {location.location && <PageDetail identifier={t('location')} information={location.location} />}
          </>
        </Page>
      </LocationLayout>
    )
  }

  const renderEventListItem = (event: EventModel) => (
    <EventListItem event={event} formatter={formatter} key={event.path} />
  )

  const pageTitle = `${t('pageTitle')} - ${cityModel.name}`

  return (
    <LocationLayout isLoading={false} {...locationLayoutParams}>
      <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} cityModel={cityModel} />
      <Caption title={t('events')} />
      <List noItemsMessage={t('currentlyNoEvents')} items={events} renderItem={renderEventListItem} />
    </LocationLayout>
  )
}

export default EventsPage
