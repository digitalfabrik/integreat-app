import EventNoteIcon from '@mui/icons-material/EventNote'
import LinkIcon from '@mui/icons-material/Link'
import LocationIcon from '@mui/icons-material/LocationOnOutlined'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'
import { DateTime } from 'luxon'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'

import { EVENTS_ROUTE, HORIZONTAL_TEXT_DIVIDER, pathnameFromRouteInformation } from 'shared'
import { createEventsEndpoint, NotFoundError } from 'shared/api'

import EventFurtherDates from '../components/EventFurtherDates'
import EventList from '../components/EventList'
import { Icon } from '../components/EventListItem'
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
  const { contentDirection } = useTheme()

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

  const pageTitle = `${event?.title ?? t('pageTitle')} - ${region.name}`

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
              <Typography variant='body1' flexDirection='column' component='div' dir={contentDirection}>
                <Stack direction='row' alignItems='center' gap={1} component='p'>
                  <EventNoteIcon />
                  <span>{date.formatDateInterval(languageCode)}</span>
                  <span aria-hidden>{HORIZONTAL_TEXT_DIVIDER}</span>
                  <span>{date.formatTimeInterval(languageCode, { allDayLabel: t('places:allDay') })}</span>
                </Stack>
                {event.isRecurring && <EventFurtherDates date={event.date} languageCode={languageCode} />}
              </Typography>
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

  return (
    <RegionContentLayout isLoading={false} {...locationLayoutParams}>
      <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} regionModel={region} />
      <H1>{t('events')}</H1>
      {events ? (
        <EventList events={events} languageCode={languageCode} />
      ) : (
        <SkeletonList listItemHeight={80} listItemIcon={<Icon />} />
      )}
    </RegionContentLayout>
  )
}

export default EventsPage
