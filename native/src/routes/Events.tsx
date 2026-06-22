import React, { ReactElement, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { RefreshControl } from 'react-native'
import { Divider } from 'react-native-paper'
import styled from 'styled-components/native'

import { EVENTS_ROUTE, GROUP_ORDER, groupEvents, RouteInformationType, useDateFilter } from 'shared'
import { fromError, NotFoundError, RegionModel, EventModel } from 'shared/api'

import Caption from '../components/Caption'
import DatesPageDetail from '../components/DatesPageDetail'
import EventListItem from '../components/EventListItem'
import EventsDateFilter from '../components/EventsDateFilter'
import ExportEventButton from '../components/ExportEventButton'
import Failure from '../components/Failure'
import Layout from '../components/Layout'
import LayoutedScrollView from '../components/LayoutedScrollView'
import List from '../components/List'
import Page from '../components/Page'
import PageDetail from '../components/PageDetail'
import Text from '../components/base/Text'
import { contentAlignment } from '../constants/contentDirection'
import useTtsPlayer from '../hooks/useTtsPlayer'

const ListContainer = styled(Layout)`
  padding: 0 8px;
`

const PageDetailsContainer = styled.View`
  gap: 8px;
`

type EventListEntry = string | EventModel

const EventSeparator = ({
  leadingItem,
  trailingItem,
}: {
  leadingItem: EventListEntry
  trailingItem: EventListEntry
}) => (typeof leadingItem === 'string' || typeof trailingItem === 'string' ? null : <Divider />)

type EventsProps = {
  slug?: string
  events: EventModel[]
  regionModel: RegionModel
  language: string
  navigateTo: (routeInformation: RouteInformationType) => void
  refresh: () => void
}

const Events = ({ regionModel, language, navigateTo, events, slug, refresh }: EventsProps): ReactElement => {
  const { t } = useTranslation('events')
  const { startDate, setStartDate, endDate, setEndDate, filteredEvents, startDateError } = useDateFilter(events)
  const event = events.find(it => it.slug === slug)
  useTtsPlayer(event)

  const groupedEvents = groupEvents(events)

  const items: (string | EventModel)[] = useMemo(() => {
    if (startDate || endDate) {
      return filteredEvents ?? []
    }

    return GROUP_ORDER.flatMap(key => {
      const bucket = groupedEvents[key]
      return bucket.length > 0 ? [t(key), ...bucket] : []
    })
  }, [startDate, endDate, filteredEvents, groupedEvents, t])

  if (!regionModel.eventsEnabled) {
    const error = new NotFoundError({
      type: 'category',
      id: 'events',
      region: regionModel.code,
      language,
    })
    return (
      <LayoutedScrollView refreshControl={<RefreshControl onRefresh={refresh} refreshing={false} />}>
        <Failure code={fromError(error)} retry={refresh} />
      </LayoutedScrollView>
    )
  }

  if (slug) {
    if (event) {
      return (
        <LayoutedScrollView refreshControl={<RefreshControl onRefresh={refresh} refreshing={false} />}>
          <Page
            content={event.content}
            title={event.title}
            lastUpdate={event.lastUpdate}
            language={language}
            beforeContent={
              <PageDetailsContainer>
                <DatesPageDetail date={event.date} languageCode={language} />
                {event.location && (
                  <PageDetail
                    icon='map-marker'
                    information={event.location.fullAddress}
                    language={language}
                    path={event.placePath}
                    accessibilityLabel={t('address')}
                  />
                )}
                {event.meetingUrl !== null && (
                  <PageDetail
                    icon='link'
                    isExternalUrl
                    information={event.meetingUrl}
                    language={language}
                    path={event.meetingUrl}
                    accessibilityLabel={t('meetingUrl')}
                  />
                )}
              </PageDetailsContainer>
            }
            footer={<ExportEventButton event={event} />}
          />
        </LayoutedScrollView>
      )
    }

    const error = new NotFoundError({
      type: 'event',
      id: slug,
      region: regionModel.code,
      language,
    })
    return <Failure code={fromError(error)} retry={refresh} />
  }

  const renderEventListItem = ({ item }: { item: string | EventModel }) => {
    if (typeof item === 'string') {
      return (
        <Text variant='body2' style={{ paddingTop: 8, paddingRight: 8, textAlign: contentAlignment(language) }}>
          {item}
        </Text>
      )
    }

    const navigateToEvent = () =>
      navigateTo({
        route: EVENTS_ROUTE,
        regionCode: regionModel.code,
        languageCode: language,
        slug: item.slug,
      })
    return (
      <EventListItem
        key={item.slug}
        event={item}
        language={language}
        navigateToEvent={navigateToEvent}
        filterStartDate={startDate}
        filterEndDate={endDate}
      />
    )
  }

  return (
    <ListContainer>
      <List
        items={items}
        renderItem={renderEventListItem}
        header={
          <>
            <Caption title={t('events')} />
            <EventsDateFilter
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              startDateError={startDateError}
              languageCode={language}
            />
          </>
        }
        refresh={refresh}
        noItemsMessage={t('currentlyNoEvents')}
        itemSeparatorComponent={EventSeparator}
      />
    </ListContainer>
  )
}

export default Events
