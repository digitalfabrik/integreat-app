import LinkIcon from '@mui/icons-material/Link'
import LocationIcon from '@mui/icons-material/LocationOnOutlined'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { DateTime } from 'luxon'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'

import {
  EVENTS_ROUTE,
  pathnameFromRouteInformation,
  useDateFilter,
  DateGroupKey,
  groupEvents,
  GROUP_ORDER,
} from 'shared'
import { createEventsEndpoint, NotFoundError } from 'shared/api'

import DatesPageDetail from '../components/DatesPageDetail'
import EventListItem, { Icon } from '../components/EventListItem'
import EventsDateFilter from '../components/EventsDateFilter'
import ExportEventButton from '../components/ExportEventButton'
import FailureSwitcherWithHelmet from '../components/FailureSwitcherWithHelmet'
import Helmet from '../components/Helmet'
import Page, { THUMBNAIL_WIDTH } from '../components/Page'
import PageDetail from '../components/PageDetail'
import RegionContentLayout, { RegionContentLayoutProps } from '../components/RegionContentLayout'
import RegionContentToolbar from '../components/RegionContentToolbar'
import SkeletonList from '../components/SkeletonList'
import SkeletonPage from '../components/SkeletonPage'
import H1 from '../components/base/H1'
import List from '../components/base/List'
import { cmsApiBaseUrl } from '../constants/urls'
import useJsonLd from '../hooks/useJsonLd'
import useQueryFromEndpoint from '../hooks/useQueryFromEndpoint'
import useTtsPlayer from '../hooks/useTtsPlayer'
import createJsonLdEvent from '../utils/createJsonLdEvent'
import featuredImageToSrcSet from '../utils/featuredImageToSrcSet'
import { RegionRouteProps } from './index'

const Spacing = styled('div')<{ content: string; lastUpdate?: DateTime }>`
  display: flex;
  flex-direction: column;
  padding-top: 12px;
  padding-bottom: ${props => (props.content.length > 0 && props.lastUpdate ? '0px' : '12px')};
  gap: 8px;
`

const EventsPage = ({ region, pathname, languageCode, regionCode }: RegionRouteProps): ReactElement | null => {
  const { eventId } = useParams()
  const { t } = useTranslation('events')

  const { data: events, error } = useQueryFromEndpoint(createEventsEndpoint, cmsApiBaseUrl, {
    region: regionCode,
    language: languageCode,
  })
  const { startDate, setStartDate, endDate, setEndDate, filteredEvents, startDateError } = useDateFilter(events ?? null)

  const groupedEvents = groupEvents(events ?? [])

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
    const path =
      event?.availableLanguages[code] ??
      pathnameFromRouteInformation({
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

  const pageTitle = `${event?.title ?? t('pageTitle')} - ${region.name}`

  const locationLayoutParams: Omit<RegionContentLayoutProps, 'isLoading'> = {
    region,
    languageChangePaths,
    languageCode,
    pageTitle,
    toolbar: <RegionContentToolbar slug={event?.slug} />,
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
    const { featuredImage, lastUpdate, content, title, location, meetingUrl, date } = event

    return (
      <RegionContentLayout isLoading={false} {...locationLayoutParams}>
        <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} regionModel={region} />
        <Page
          thumbnailSrcSet={featuredImage ? featuredImageToSrcSet(featuredImage, THUMBNAIL_WIDTH) : undefined}
          lastUpdate={lastUpdate}
          content={content}
          title={title}
          beforeContent={
            <Spacing content={content} lastUpdate={lastUpdate}>
              <DatesPageDetail date={date} language={languageCode} />
              {location && (
                <PageDetail
                  tooltip={t('address')}
                  icon={<LocationIcon />}
                  information={location.fullAddress}
                  path={event.placePath}
                />
              )}
              {!!meetingUrl && (
                <PageDetail tooltip={t('meetingUrl')} icon={<LinkIcon />} information={meetingUrl} path={meetingUrl} />
              )}
            </Spacing>
          }
          footer={<ExportEventButton event={event} />}
        />
      </RegionContentLayout>
    )
  }

  const groupedListSections = GROUP_ORDER.map((key: DateGroupKey) => {
    const eventsGroup = groupedEvents[key]
    if (eventsGroup.length === 0) {
      return []
    }

    return (
      <section key={key}>
        <Typography component='span' variant='body1' dir='auto'>
          {t(key)}
        </Typography>
        <List
          items={eventsGroup.map(event => (
            <EventListItem event={event} languageCode={languageCode} key={event.path} />
          ))}
        />
      </section>
    )
  })

  const filteredListItems = (
    <List
      items={(filteredEvents ?? []).map(event => (
        <EventListItem
          event={event}
          languageCode={languageCode}
          key={event.path}
          filterStartDate={startDate}
          filterEndDate={endDate}
        />
      ))}
      noItemsMessage='events:currentlyNoEvents'
    />
  )

  const groupedList = GROUP_ORDER.some(key => groupedEvents[key].length > 0)

  let eventsList
  if (startDate || endDate) {
    eventsList = filteredListItems
  } else if (groupedList) {
    eventsList = groupedListSections
  } else {
    eventsList = <List items={[]} noItemsMessage='events:currentlyNoEvents' />
  }

  return (
    <RegionContentLayout isLoading={false} {...locationLayoutParams}>
      <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} regionModel={region} />
      <H1>{t('events')}</H1>
      <EventsDateFilter
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        startDateError={startDateError}
      />
      {events ? eventsList : <SkeletonList listItemHeight={80} listItemIcon={<Icon />} />}
    </RegionContentLayout>
  )
}

export default EventsPage
