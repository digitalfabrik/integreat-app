import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import { EVENTS_ROUTE, EVENT_DATE_GROUPS, groupEventsByDate, RouteInformationType, useDateFilter } from 'shared'
import { RegionModel, EventModel } from 'shared/api'

import Caption from '../components/Caption'
import EventListItem from '../components/EventListItem'
import EventsDateFilter from '../components/EventsDateFilter'
import Layout from '../components/Layout'
import List from '../components/List'
import Text from '../components/base/Text'
import { contentAlignment } from '../constants/contentDirection'

const ListContainer = styled(Layout)`
  padding: 0 8px;
`

type EventListEntry = string | EventModel

type EventListProps = {
  events: EventModel[]
  regionModel: RegionModel
  language: string
  navigateTo: (routeInformation: RouteInformationType) => void
  refresh: () => void
}

const EventList = ({ events, regionModel, language, navigateTo, refresh }: EventListProps): ReactElement => {
  const { t } = useTranslation('events')
  const { startDate, setStartDate, endDate, setEndDate, filteredEvents, startDateError } = useDateFilter(events)

  const groupedEvents = groupEventsByDate(events)

  const items =
    startDate || endDate
      ? (filteredEvents ?? [])
      : EVENT_DATE_GROUPS.flatMap(key => {
          const dateGroup = groupedEvents[key]
          return dateGroup.length > 0 ? [t(key), ...dateGroup] : []
        })

  const renderEventListItem = ({ item }: { item: EventListEntry }) => {
    if (typeof item === 'string') {
      return (
        <Text variant='body2' style={{ paddingTop: 8, textAlign: contentAlignment(language) }}>
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
      />
    </ListContainer>
  )
}

export default EventList
