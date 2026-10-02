import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'

import { EVENTS_ROUTE, pathnameFromRouteInformation } from 'shared'
import { createEventsEndpoint, NotFoundError } from 'shared/api'

import EventDetail from '../components/EventDetail'
import EventList from '../components/EventList'
import { Icon } from '../components/EventListItem'
import FailureSwitcherWithHelmet from '../components/FailureSwitcherWithHelmet'
import Helmet from '../components/Helmet'
import RegionContentLayout, { RegionContentLayoutProps } from '../components/RegionContentLayout'
import RegionContentToolbar from '../components/RegionContentToolbar'
import SkeletonList from '../components/SkeletonList'
import SkeletonPage from '../components/SkeletonPage'
import H1 from '../components/base/H1'
import { cmsApiBaseUrl } from '../constants/urls'
import useJsonLd from '../hooks/useJsonLd'
import useQueryFromEndpoint from '../hooks/useQueryFromEndpoint'
import useTtsPlayer from '../hooks/useTtsPlayer'
import createJsonLdEvent from '../utils/createJsonLdEvent'
import { RegionRouteProps } from './index'

const EventsPage = ({ region, pathname, languageCode, regionCode }: RegionRouteProps): ReactElement | null => {
  const { eventId } = useParams()
  const { t } = useTranslation()

  const { data: events, error } = useQueryFromEndpoint(createEventsEndpoint, cmsApiBaseUrl, {
    region: regionCode,
    language: languageCode,
  })

  // Support legacy slugs of old recurring events with one event per recurrence
  const pathnameWithoutDate = pathname.split('$')[0]
  const event = eventId ? events?.find(it => it.path === pathnameWithoutDate) : null
  useTtsPlayer(event, languageCode)
  useJsonLd(event ? createJsonLdEvent(event) : null)

  if (!region) {
    return null
  }

  const languageChangePaths = region.languages.map(({ code, name }) => {
    const isCurrentLanguage = code === languageCode
    const path = event
      ? (event.availableLanguages[code] ?? null)
      : pathnameFromRouteInformation({
          route: EVENTS_ROUTE,
          regionCode,
          languageCode: code,
        })
    return {
      path: isCurrentLanguage ? pathname : path,
      name,
      code,
    }
  })

  const pageTitle = `${event?.title ?? t($ => $.events.title)} - ${region.name}`

  const locationLayoutParams: Omit<RegionContentLayoutProps, 'isLoading'> = {
    region,
    languageChangePaths,
    languageCode,
    pageTitle,
    slug: event?.slug ?? null,
    toolbar: <RegionContentToolbar />,
  }

  if (error) {
    return (
      <RegionContentLayout isLoading={false} {...locationLayoutParams}>
        <FailureSwitcherWithHelmet error={error} />
      </RegionContentLayout>
    )
  }

  if (eventId) {
    if (!events) {
      return (
        <RegionContentLayout isLoading {...locationLayoutParams}>
          <SkeletonPage />
        </RegionContentLayout>
      )
    }

    if (!event) {
      const error = new NotFoundError({ type: 'event', id: pathname, region: regionCode, language: languageCode })
      return (
        <RegionContentLayout isLoading={false} {...locationLayoutParams}>
          <FailureSwitcherWithHelmet error={error} />
        </RegionContentLayout>
      )
    }

    return (
      <RegionContentLayout isLoading={false} {...locationLayoutParams}>
        <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} regionModel={region} />
        <EventDetail key={event.id} event={event} languageCode={languageCode} regionCode={regionCode} />
      </RegionContentLayout>
    )
  }

  return (
    <RegionContentLayout isLoading={false} {...locationLayoutParams}>
      <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} regionModel={region} />
      <H1>{t($ => $.events.title)}</H1>
      {events ? (
        <EventList events={events} languageCode={languageCode} regionCode={regionCode} />
      ) : (
        <SkeletonList listItemHeight={80} listItemIcon={<Icon />} />
      )}
    </RegionContentLayout>
  )
}

export default EventsPage
