import { TFunction } from 'i18next'
import { DateTime } from 'luxon'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'

import { EVENTS_ROUTE, pathnameFromRouteInformation } from 'shared'
import { createEventsEndpoint, EventModel, NotFoundError, useLoadFromEndpoint } from 'shared/api'
import useDateFilter from 'shared/hooks/useDateFilter'

import { CityRouteProps } from '../CityContentSwitcher'
import { ShrinkIcon, ExpandIcon, CloseIcon } from '../assets'
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
import Button from '../components/base/Button'
import Icon from '../components/base/Icon'
import dimensions from '../constants/dimensions'
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
  margin: 0 5px 15px;
  justify-content: center;

  @media ${dimensions.smallViewport} {
    flex-direction: column;
    align-items: center;
  }
`
const StyledButton = styled(Button)`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
  font-weight: bold;
  padding: 5px;
`
const HideDateButton = styled(StyledButton)`
  display: none;
  align-self: flex-start;

  @media ${dimensions.smallViewport} {
    display: flex;
  }
`

const DateFilterToggle = ({
  toggle,
  setToggleDateFilter,
  t,
}: {
  toggle: boolean
  setToggleDateFilter: React.Dispatch<React.SetStateAction<boolean>>
  t: TFunction<'events', undefined>
}) => (
  <HideDateButton label='toggleDate' onClick={() => setToggleDateFilter((prev: boolean) => !prev)}>
    <Icon src={toggle ? ShrinkIcon : ExpandIcon} />
    {toggle ? <span>{t('hide_filters')}</span> : <span>{t('show_filters')}</span>}
  </HideDateButton>
)

const EventsPage = ({ city, pathname, languageCode, cityCode }: CityRouteProps): ReactElement | null => {
  const previousPathname = usePreviousProp({ prop: pathname })
  const { eventId } = useParams()
  const { t } = useTranslation('events')
  const navigate = useNavigate()

  const defaultFromDate = DateTime.local().toFormat('yyyy-MM-dd').toLocaleString()
  const defaultToDate = DateTime.local().plus({ day: 10 }).toFormat('yyyy-MM-dd').toLocaleString()
  const [toggleDateFilter, setToggleDateFilter] = useState(true)

  const {
    data: events,
    loading,
    error: eventsError,
  } = useLoadFromEndpoint(createEventsEndpoint, cmsApiBaseUrl, { city: cityCode, language: languageCode })

  const { fromDate, setFromDate, toDate, setToDate, filteredEvents, fromDateError, toDateError } = useDateFilter(
    events,
    key => t(key),
  )
  const isReset = fromDate === defaultFromDate && toDate === defaultToDate

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
        <DateFilterToggle toggle={toggleDateFilter} setToggleDateFilter={setToggleDateFilter} t={t} />
        {toggleDateFilter && (
          <>
            <CustomDatePicker
              title={t('from')}
              value={fromDate}
              setValue={setFromDate}
              error={(fromDateError as string) || ''}
            />
            <CustomDatePicker
              title={t('to')}
              value={toDate}
              setValue={setToDate}
              error={(toDateError as string) || ''}
            />
          </>
        )}
      </DateSection>
      {!isReset && toggleDateFilter && (
        <StyledButton
          label='resetDate'
          onClick={() => {
            setFromDate(defaultFromDate)
            setToDate(defaultToDate)
          }}>
          <Icon src={CloseIcon} />
          <span>{`${t('resetFilter')} ${DateTime.fromISO((fromDate as string) || defaultFromDate).toFormat('dd/MM/yy')} - ${DateTime.fromISO((toDate as string) || defaultFromDate).toFormat('dd/MM/yy')}`}</span>
        </StyledButton>
      )}
      <List noItemsMessage={t('currentlyNoEvents')} items={filteredEvents} renderItem={renderEventListItem} />
    </CityContentLayout>
  )
}

export default EventsPage
