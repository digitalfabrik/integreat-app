import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import { DateTime } from 'luxon'
import React, { ReactElement, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { GroupedVirtuoso, Virtuoso } from 'react-virtuoso'

import { groupEventsByDate, eventGroupTitle } from 'shared'
import { EventModel } from 'shared/api'

import EventListItem from '../components/EventListItem'
import EventsDateFilter from '../components/EventsDateFilter'
import useDateFilter from '../hooks/useDateFilter'
import useDimensions from '../hooks/useDimensions'
import List, { StickyListSubheader } from './base/List'

const Container = styled(Stack)(() => ({
  height: '90%',
}))

const EventsListWrapper = styled(Box)(() => ({
  flex: 1,
  minHeight: 0,
}))

type FilteredEventListContext = {
  languageCode: string
  filterStartDate: DateTime | null
  filterEndDate: DateTime | null
}

type GroupedEventListContext = {
  languageCode: string
  flatEvents: EventModel[]
  groupTitles: string[]
  stickyTop: number
}

const renderFilteredEventListItem = (
  index: number,
  event: EventModel,
  { languageCode, filterStartDate, filterEndDate }: FilteredEventListContext,
) => (
  <>
    <EventListItem
      event={event}
      languageCode={languageCode}
      filterStartDate={filterStartDate}
      filterEndDate={filterEndDate}
    />
    <Divider />
  </>
)

const renderGroupedEventListItem = (
  index: number,
  _groupIndex: number,
  _data: EventModel,
  { languageCode, flatEvents }: GroupedEventListContext,
) => {
  const event = flatEvents[index]
  if (!event) {
    return []
  }
  return (
    <>
      <EventListItem event={event} languageCode={languageCode} />
      <Divider />
    </>
  )
}

const renderGroupTitles = (index: number, { groupTitles, stickyTop }: GroupedEventListContext) => (
  <StickyListSubheader component='h2' stickyTop={stickyTop}>
    {groupTitles[index]}
  </StickyListSubheader>
)

const computeItemKey = (_index: number, event: EventModel) => event.path
const computeGroupedItemKey = (index: number, _item: EventModel, { flatEvents }: GroupedEventListContext): string =>
  flatEvents[index]?.path ?? String(index)

type EventListProps = {
  events: EventModel[]
  languageCode: string
}

const EventList = ({ events, languageCode }: EventListProps): ReactElement | null => {
  const { t } = useTranslation()
  const { startDate, setStartDate, endDate, setEndDate, filteredEvents, startDateError, resetDates } =
    useDateFilter(events)
  const { stickyTop } = useDimensions()

  const { flatEvents, groupCounts, groupTitles } = useMemo(() => {
    const grouped = groupEventsByDate(events)
    return {
      flatEvents: grouped.flatMap(([, groupEvents]) => groupEvents),
      groupCounts: grouped.map(([, groupEvents]) => groupEvents.length),
      groupTitles: grouped.map(([key]) => {
        const [titleKey, params] = eventGroupTitle(key)
        return t($ => $.events[titleKey], params)
      }),
    }
  }, [events, t])

  const dateFilter = (
    <EventsDateFilter
      startDate={startDate}
      setStartDate={setStartDate}
      endDate={endDate}
      setEndDate={setEndDate}
      startDateError={startDateError}
      resetDates={resetDates}
    />
  )

  const isFiltering = Boolean(startDate || endDate)
  const isEmpty = isFiltering ? filteredEvents.length === 0 : groupCounts.length === 0

  if (isEmpty) {
    return (
      <>
        {dateFilter}
        <List items={[]} noItemsMessage={t($ => $.events.currentlyNoEvents)} />
      </>
    )
  }

  const virtuosoStyle = {
    height: '100%',
    scrollbarWidth: 'none' as const,
    msOverflowStyle: 'none' as const,
  }

  if (isFiltering) {
    return (
      <Container>
        {dateFilter}
        <EventsListWrapper>
          <Virtuoso
            key='filteredEvents'
            style={virtuosoStyle}
            data={filteredEvents}
            context={{
              languageCode,
              filterStartDate: startDate,
              filterEndDate: endDate,
            }}
            computeItemKey={computeItemKey}
            itemContent={renderFilteredEventListItem}
          />
        </EventsListWrapper>
      </Container>
    )
  }

  return (
    <Container>
      {dateFilter}
      <EventsListWrapper>
        <GroupedVirtuoso
          key='groupedEvents'
          style={virtuosoStyle}
          groupCounts={groupCounts}
          context={{ languageCode, flatEvents, groupTitles, stickyTop }}
          computeItemKey={computeGroupedItemKey}
          groupContent={renderGroupTitles}
          itemContent={renderGroupedEventListItem}
        />
      </EventsListWrapper>
    </Container>
  )
}

export default EventList
