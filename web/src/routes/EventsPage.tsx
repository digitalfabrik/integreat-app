import LocationIcon from '@mui/icons-material/LocationOnOutlined'
import { styled } from '@mui/material/styles'
import { DateTime } from 'luxon'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'

import { EVENTS_ROUTE, pathnameFromRouteInformation, useDateFilter } from 'shared'
import { createEventsEndpoint, NotFoundError, useLoadFromEndpoint } from 'shared/api'

import { CityRouteProps } from '../CityContentSwitcher'
import CityContentLayout, { CityContentLayoutProps } from '../components/CityContentLayout'
import CityContentToolbar from '../components/CityContentToolbar'
import DatesPageDetail from '../components/DatesPageDetail'
import EventListItem from '../components/EventListItem'
import EventsDateFilter from '../components/EventsDateFilter'
import ExportEventButton from '../components/ExportEventButton'
import FailureSwitcher from '../components/FailureSwitcher'
import Helmet from '../components/Helmet'
import JsonLdEvent from '../components/JsonLdEvent'
import Page, { THUMBNAIL_WIDTH } from '../components/Page'
import PageDetail from '../components/PageDetail'
import PageSkeleton from '../components/PageSkeleton'
import SkeletonHeader from '../components/SkeletonHeader'
import SkeletonList from '../components/SkeletonList'
import H1 from '../components/base/H1'
import List from '../components/base/List'
import { cmsApiBaseUrl } from '../constants/urls'
import useTtsPlayer from '../hooks/useTtsPlayer'
import featuredImageToSrcSet from '../utils/featuredImageToSrcSet'

const Spacing = styled('div')<{ content: string; lastUpdate?: DateTime }>`
  display: flex;
  flex-direction: column;
  padding-top: 12px;
  padding-bottom: ${props => (props.content.length > 0 && props.lastUpdate ? '0px' : '12px')};
  gap: 8px;
`

const EventsPage = ({ city, pathname, languageCode, cityCode }: CityRouteProps): ReactElement | null => {
  const { eventId } = useParams()
  const { t } = useTranslation('events')

  const { data: events, error } = useLoadFromEndpoint(createEventsEndpoint, cmsApiBaseUrl, {
    city: cityCode,
    language: languageCode,
  })
  const { startDate, setStartDate, endDate, setEndDate, filteredEvents, startDateError } = useDateFilter(events)

  // Support legacy slugs of old recurring events with one event per recurrence
  const pathnameWithoutDate = pathname.split('$')[0]
  const event = eventId ? events?.find(it => it.path === pathnameWithoutDate) : null
  useTtsPlayer(event, languageCode)

  if (!city) {
    return null
  }

  const languageChangePaths = city.languages.map(({ code, name }) => {
    const isCurrentLanguage = code === languageCode
    const path =
      event?.availableLanguages[code] ??
      pathnameFromRouteInformation({
        route: EVENTS_ROUTE,
        cityCode,
        languageCode: code,
      })
    return {
      path: isCurrentLanguage ? pathname : path,
      name,
      code,
    }
  })

  const pageTitle = `${event?.title ?? t('pageTitle')} - ${city.name}`

  const locationLayoutParams: Omit<CityContentLayoutProps, 'isLoading'> = {
    city,
    languageChangePaths,
    languageCode,
    pageTitle,
    Toolbar: <CityContentToolbar slug={event?.slug} />,
  }

  if (error) {
    return (
      <CityContentLayout isLoading={false} {...locationLayoutParams}>
        <FailureSwitcher error={error} />
      </CityContentLayout>
    )
  }

  if (eventId) {
    if (!events) {
      return (
        <CityContentLayout isLoading {...locationLayoutParams}>
          <SkeletonHeader />
          <PageSkeleton />
        </CityContentLayout>
      )
    }

    if (!event) {
      const error = new NotFoundError({ type: 'event', id: pathname, city: cityCode, language: languageCode })
      return (
        <CityContentLayout isLoading={false} {...locationLayoutParams}>
          <FailureSwitcher error={error} />
        </CityContentLayout>
      )
    }
    const { featuredImage, lastUpdate, content, title, location, date } = event

    return (
      <CityContentLayout isLoading={false} {...locationLayoutParams}>
        <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} cityModel={city} />
        <JsonLdEvent event={event} />
        <Page
          thumbnailSrcSet={featuredImage ? featuredImageToSrcSet(featuredImage, THUMBNAIL_WIDTH) : undefined}
          lastUpdate={lastUpdate}
          content={content}
          title={title}
          BeforeContent={
            <Spacing content={content} lastUpdate={lastUpdate}>
              <DatesPageDetail date={date} language={languageCode} />
              {location && (
                <PageDetail icon={<LocationIcon />} information={location.fullAddress} path={event.poiPath} />
              )}
            </Spacing>
          }
          Footer={<ExportEventButton event={event} />}
        />
      </CityContentLayout>
    )
  }

  const items = (filteredEvents ?? []).map(event => (
    <EventListItem
      event={event}
      languageCode={languageCode}
      key={event.path}
      filterStartDate={startDate}
      filterEndDate={endDate}
    />
  ))

  return (
    <CityContentLayout isLoading={false} {...locationLayoutParams}>
      <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} cityModel={city} />
      <H1>{t('events')}</H1>
      <EventsDateFilter
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        startDateError={startDateError}
      />
      {events ? (
        <List items={items} NoItemsMessage='events:currentlyNoEvents' />
      ) : (
        <SkeletonList listItemHeight={160} iconHeight={96} iconWidth={96} />
      )}
    </CityContentLayout>
  )
}

export default EventsPage
