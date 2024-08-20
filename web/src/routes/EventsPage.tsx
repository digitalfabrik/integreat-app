import { DateTime } from 'luxon'
import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'

import { EVENTS_ROUTE, pathnameFromRouteInformation } from 'shared'
import { createEventsEndpoint, EventModel, NotFoundError, useLoadFromEndpoint } from 'shared/api'

import { CityRouteProps } from '../CityContentSwitcher'
import Caption from '../components/Caption'
import CityContentLayout, { CityContentLayoutProps } from '../components/CityContentLayout'
import CityContentToolbar from '../components/CityContentToolbar'
import CustomDatePicker from '../components/CustomDatePicker'
import DatesPageDetail from '../components/DatesPageDetail'
import EventListItem from '../components/EventListItem'
import ExportEventButton from '../components/ExportEventButton'
import FailureSwitcher from '../components/FailureSwitcher'
import Helmet from '../components/Helmet'
import JsonLdEvent from '../components/JsonLdEvent'
import List from '../components/List'
import LoadingSpinner from '../components/LoadingSpinner'
import Page, { THUMBNAIL_WIDTH } from '../components/Page'
import PageDetail from '../components/PageDetail'
import { cmsApiBaseUrl } from '../constants/urls'
import usePreviousProp from '../hooks/usePreviousProp'
import featuredImageToSrcSet from '../utils/featuredImageToSrcSet'

const Spacing = styled.div<{ $content: string; $lastUpdate?: DateTime }>`
  display: flex;
  flex-direction: column;
  padding-top: 12px;
  padding-bottom: ${props => (props.$content.length > 0 && props.$lastUpdate ? '0px' : '12px')};
  gap: 8px;
`

const DateSection = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin-bottom: 20px;
  justify-content: center;
`

const EventsPage = ({ city, pathname, languageCode, cityCode }: CityRouteProps): ReactElement | null => {
  const previousPathname = usePreviousProp({ prop: pathname })
  const { eventId } = useParams()
  const { t } = useTranslation('events')
  const navigate = useNavigate()

  const [fromDate, setFromDate] = useState<string>(DateTime.local().toFormat('yyyy-MM-dd').toLocaleString())
  const [toDate, setToDate] = useState<string>(
    DateTime.local().plus({ year: 1 }).toFormat('yyyy-MM-dd').toLocaleString(),
  )
  const [filteredEvents, setFilteredEvents] = useState<EventModel[]>([])
  const [fromError, setFromError] = useState('')
  const [toError, setToError] = useState('')

  const {
    data: events,
    loading,
    error: eventsError,
  } = useLoadFromEndpoint(createEventsEndpoint, cmsApiBaseUrl, { city: cityCode, language: languageCode })

  useEffect(() => {
    const isValidDateFormat = (date: string) => {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/
      return dateRegex.test(date)
    }
    const filterByDateRange = (from: string, to: string) => {
      setToError('')
      setFromError('')

      if (!isValidDateFormat(from)) {
        setFromError('Invalid `from` date format')
        return []
      }

      if (!isValidDateFormat(to)) {
        setToError('Invalid `to` date format')
        return []
      }
      const fromDateTime = DateTime.fromISO(from)
      const toDateTime = DateTime.fromISO(to).endOf('day')

      if (fromDateTime > toDateTime) {
        setFromError('`from` date should be earlier than `to` date')
        return []
      }
      return (
        events?.filter(
          event =>
            DateTime.fromISO(event.date.startDate) >= fromDateTime &&
            DateTime.fromISO(event.date.endDate) <= toDateTime,
        ) || []
      )
    }
    setFilteredEvents(filterByDateRange(fromDate, toDate))
  }, [fromDate, toDate, events])

  if (!city) {
    return null
  }

  // Support legacy slugs of old recurring events with one event per recurrence
  const pathnameWithoutDate = pathname.split('$')[0]
  const event = eventId ? events?.find(it => it.path === pathnameWithoutDate) : null
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
    route: EVENTS_ROUTE,
    languageCode,
    Toolbar: (
      <CityContentToolbar
        feedbackTarget={event?.slug}
        route={EVENTS_ROUTE}
        hideDivider={!event}
        pageTitle={pageTitle}
      />
    ),
  }

  if (loading || pathname !== previousPathname) {
    return (
      <CityContentLayout isLoading {...locationLayoutParams}>
        <LoadingSpinner />
      </CityContentLayout>
    )
  }

  if (!events || (eventId && !event)) {
    const error =
      eventsError ||
      new NotFoundError({
        type: 'event',
        id: pathname,
        city: cityCode,
        language: languageCode,
      })

    return (
      <CityContentLayout isLoading={false} {...locationLayoutParams}>
        <FailureSwitcher error={error} />
      </CityContentLayout>
    )
  }

  if (event) {
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
          onInternalLinkClick={navigate}
          BeforeContent={
            <Spacing $content={content} $lastUpdate={lastUpdate}>
              <DatesPageDetail date={date} languageCode={languageCode} />
              {location && <PageDetail identifier={t('address')} information={location.fullAddress} />}
            </Spacing>
          }
          Footer={<ExportEventButton event={event} />}
        />
      </CityContentLayout>
    )
  }

  const renderEventListItem = (event: EventModel) => (
    <EventListItem event={event} languageCode={languageCode} key={event.path} />
  )

  return (
    <CityContentLayout isLoading={false} {...locationLayoutParams}>
      <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} cityModel={city} />
      <Caption title={t('events')} />
      <DateSection>
        <CustomDatePicker title='from' value={fromDate} setValue={setFromDate} error={fromError} />
        <CustomDatePicker title='to' value={toDate} setValue={setToDate} error={toError} />
      </DateSection>
      <List noItemsMessage={t('currentlyNoEvents')} items={filteredEvents} renderItem={renderEventListItem} />
    </CityContentLayout>
  )
}

export default EventsPage
