import React, { ReactElement, useCallback, useContext } from 'react'
import { RouteComponentProps, useHistory } from 'react-router-dom'
import LocationLayout from '../components/LocationLayout'
import {
  EVENTS_ROUTE,
  CityModel,
  LanguageModel,
  EventModel,
  NotFoundError,
  useLoadFromEndpoint,
  createEventsEndpoint,
  normalizePath
} from 'api-client'
import LocationToolbar from '../components/LocationToolbar'
import { FeedbackRatingType } from '../components/FeedbackToolbarItem'
import DateFormatterContext from '../contexts/DateFormatterContext'
import { cmsApiBaseUrl } from '../constants/urls'
import LoadingSpinner from '../components/LoadingSpinner'
import { createPath } from './index'
import FailureSwitcher from '../components/FailureSwitcher'
import Page, { THUMBNAIL_WIDTH } from '../components/Page'
import PageDetail from '../components/PageDetail'
import featuredImageToSrcSet from '../utils/featuredImageToSrcSet'
import { useTranslation } from 'react-i18next'
import List from '../components/List'
import Caption from '../components/Caption'
import EventListItem from '../components/EventListItem'
import JsonLdEvent from '../components/JsonLdEvent'
import useWindowDimensions from '../hooks/useWindowDimensions'
import Helmet from '../components/Helmet'

type PropsType = {
  cities: Array<CityModel>
  cityModel: CityModel
  languages: Array<LanguageModel>
  languageModel: LanguageModel
} & RouteComponentProps<{ cityCode: string; languageCode: string; eventId?: string }>

const EventsPage = ({ cityModel, match, location, languages }: PropsType): ReactElement => {
  const { cityCode, languageCode, eventId } = match.params
  const pathname = normalizePath(location.pathname)
  const history = useHistory()
  const { t } = useTranslation('events')
  const formatter = useContext(DateFormatterContext)
  const { viewportSmall } = useWindowDimensions()

  const requestEvents = useCallback(async () => {
    return createEventsEndpoint(cmsApiBaseUrl).request({ city: cityCode, language: languageCode })
  }, [cityCode, languageCode])
  const { data: events, loading, error: eventsError } = useLoadFromEndpoint(requestEvents)

  const event = eventId && events?.find((event: EventModel) => event.path === pathname)

  const toolbar = (openFeedback: (rating: FeedbackRatingType) => void) => (
    <LocationToolbar openFeedbackModal={openFeedback} viewportSmall={viewportSmall} />
  )

  const languageChangePaths = languages.map(({ code, name }) => {
    const rootPath = createPath(EVENTS_ROUTE, { cityCode, languageCode: code })
    return {
      path: event ? event.availableLanguages.get(code) || null : rootPath,
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
    pathname,
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

  const pageTitle = `${t('app:pageTitles.events')} - ${cityModel.name}`

  return (
    <LocationLayout isLoading={false} {...locationLayoutParams}>
      <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} cityModel={cityModel} />
      <Caption title={t('events')} />
      <List noItemsMessage={t('currentlyNoEvents')} items={events} renderItem={renderEventListItem} />
    </LocationLayout>
  )
}

export default EventsPage
