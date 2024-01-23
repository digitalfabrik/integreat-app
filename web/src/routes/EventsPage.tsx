import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'

import {
  createEventsEndpoint,
  EventModel,
  EVENTS_ROUTE,
  NotFoundError,
  pathnameFromRouteInformation,
  useLoadFromEndpoint,
} from 'api-client'

import { CityRouteProps } from '../CityContentSwitcher'
import Caption from '../components/Caption'
import CityContentLayout, { CityContentLayoutProps } from '../components/CityContentLayout'
import CityContentToolbar from '../components/CityContentToolbar'
import DatesPageDetail from '../components/DatesPageDetail'
import EventListItem from '../components/EventListItem'
import FailureSwitcher from '../components/FailureSwitcher'
import Helmet from '../components/Helmet'
import JsonLdEvent from '../components/JsonLdEvent'
import List from '../components/List'
import LoadingSpinner from '../components/LoadingSpinner'
import Page, { THUMBNAIL_WIDTH } from '../components/Page'
import PageDetail from '../components/PageDetail'
import RadioGroup from '../components/base/RadioGroup'
import TextButton from '../components/base/TextButton'
import buildConfig from '../constants/buildConfig'
import dimensions from '../constants/dimensions'
import { cmsApiBaseUrl } from '../constants/urls'
import usePreviousProp from '../hooks/usePreviousProp'
import useWindowDimensions from '../hooks/useWindowDimensions'
import featuredImageToSrcSet from '../utils/featuredImageToSrcSet'

const ButtonContainer = styled.div`
  display: flex;
  gap: 16px;

  @media ${dimensions.smallViewport} {
    flex-direction: column;
  }
`

const CancelButton = styled(TextButton)<{ fullWidth: boolean }>`
  ${props => props.fullWidth && 'width: 100%;'}
  background-color: ${props => props.theme.colors.textDecorationColor};
  margin: 0;
`

const StyledButton = styled(TextButton)<{ fullWidth: boolean }>`
  ${props => props.fullWidth && 'width: 100%;'}
  margin: 0;
`

const Spacing = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 12px;
  gap: 8px;
`

const EventsPage = ({ city, pathname, languageCode, cityCode }: CityRouteProps): ReactElement | null => {
  const previousPathname = usePreviousProp({ prop: pathname })
  const { eventId } = useParams()
  const { t } = useTranslation('events')
  const { viewportSmall } = useWindowDimensions()
  const navigate = useNavigate()
  const [isExporting, setIsExporting] = useState<boolean>(false)
  const [exportOnce, setExportOnce] = useState<boolean>(true)

  const {
    data: events,
    loading,
    error: eventsError,
  } = useLoadFromEndpoint(createEventsEndpoint, cmsApiBaseUrl, { city: cityCode, language: languageCode })

  if (!city) {
    return null
  }

  // Support legacy slugs of old recurring events with one event per recurrence
  const pathnameWithoutDate = pathname.split('$')[0]
  const event = eventId ? events?.find(it => it.path === pathnameWithoutDate) : null
  const languageChangePaths = city.languages.map(({ code, name }) => {
    const isCurrentLanguage = code === languageCode
    const path = event
      ? event.availableLanguages.get(code) || null
      : pathnameFromRouteInformation({ route: EVENTS_ROUTE, cityCode, languageCode: code })
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

  const downloadEventAsIcsFile = (event: EventModel, recurring: boolean) => {
    const blob = new Blob([event.toICal(window.location.origin, buildConfig().appName, recurring)], {
      type: 'text/calendar;charset=utf-8',
    })
    const anchorElement = document.createElement('a')
    anchorElement.href = window.URL.createObjectURL(blob)
    anchorElement.setAttribute('download', `${event.title}.ics`)
    document.body.appendChild(anchorElement)
    anchorElement.click()
    document.body.removeChild(anchorElement)
  }

  if (event) {
    const { featuredImage, thumbnail, lastUpdate, content, title, location, date } = event
    const defaultThumbnail = featuredImage ? featuredImage.medium.url : thumbnail
    const isRecurring = !!event.date.recurrenceRule

    const PageFooter =
      isExporting && isRecurring ? (
        <>
          <RadioGroup
            caption={t('addToCalendar')}
            groupId='recurring'
            selectedValue={exportOnce ? 'one' : 'many'}
            onChange={value => {
              setExportOnce(value === 'one')
            }}
            values={[
              { key: 'one', label: t('onlyThisEvent') },
              { key: 'many', label: t('thisAndAllFutureEvents') },
            ]}
          />
          <ButtonContainer>
            <CancelButton onClick={() => setIsExporting(false)} text={t('layout:cancel')} fullWidth={viewportSmall} />
            <StyledButton
              onClick={() => downloadEventAsIcsFile(event, !exportOnce)}
              text={t('exportAsICal')}
              fullWidth={viewportSmall}
            />
          </ButtonContainer>
        </>
      ) : (
        <StyledButton
          onClick={() => (isRecurring ? setIsExporting(true) : downloadEventAsIcsFile(event, false))}
          text={t('exportAsICal')}
          fullWidth={viewportSmall}
        />
      )

    return (
      <CityContentLayout isLoading={false} {...locationLayoutParams}>
        <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} cityModel={city} />
        <JsonLdEvent event={event} />
        <Page
          defaultThumbnailSrc={defaultThumbnail}
          thumbnailSrcSet={featuredImage ? featuredImageToSrcSet(featuredImage, THUMBNAIL_WIDTH) : undefined}
          lastUpdate={lastUpdate}
          content={content}
          title={title}
          onInternalLinkClick={navigate}
          BeforeContent={
            <Spacing>
              <DatesPageDetail date={date} languageCode={languageCode} />
              {location && <PageDetail identifier={t('address')} information={location.fullAddress} />}
            </Spacing>
          }
          Footer={PageFooter}
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
      <List noItemsMessage={t('currentlyNoEvents')} items={events} renderItem={renderEventListItem} />
    </CityContentLayout>
  )
}

export default EventsPage
