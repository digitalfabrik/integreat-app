import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import { DateTime } from 'luxon'
import React, { ReactElement, useLayoutEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { GroupedVirtuoso, GroupedVirtuosoHandle, StateSnapshot, Virtuoso, VirtuosoHandle } from 'react-virtuoso'

import { groupEventsByDate, eventGroupTitle } from 'shared'
import { EventModel } from 'shared/api'

import EventListItem from '../components/EventListItem'
import EventsDateFilter from '../components/EventsDateFilter'
import useDateFilter from '../hooks/useDateFilter'
import useDimensions from '../hooks/useDimensions'
import List, { StickyListSubheader } from './base/List'

let filteredSnapshot: StateSnapshot | undefined
let groupedSnapshot: StateSnapshot | undefined

const Container = styled(Stack)(() => ({
  height: 'auto',
}))

const FilteredListWrapper = styled(Box)(() => ({
  flex: 1,
  minHeight: '100vh',
}))

const GroupedListWrapper = styled(Box)<{ $stickyTop: number }>(({ $stickyTop }) => ({
  flex: 1,
  minHeight: '100vh',
  '& [data-virtuoso-scroller] > div:first-of-type': {
    top: `${$stickyTop}px !important`,
  },
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

const renderGroupTitles = (index: number, { groupTitles }: GroupedEventListContext) => (
  <StickyListSubheader component='h2'>{groupTitles[index]}</StickyListSubheader>
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
  const { stickyTop } = useDimensions()

  const { startDate, setStartDate, endDate, setEndDate, filteredEvents, startDateError, resetDates } =
    useDateFilter(events)

  const filteredRef = useRef<VirtuosoHandle>(null)
  const groupedRef = useRef<GroupedVirtuosoHandle>(null)

  // Handles scroll restoration
  useLayoutEffect(
    () => () => {
      filteredRef.current?.getState(snapshot => {
        filteredSnapshot = snapshot
      })
      groupedRef.current?.getState(snapshot => {
        groupedSnapshot = snapshot
      })
    },
    [],
  )

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

  if (isFiltering) {
    return (
      <Container>
        {dateFilter}
        <FilteredListWrapper>
          <Virtuoso
            key='filteredEvents'
            ref={filteredRef}
            useWindowScroll
            restoreStateFrom={filteredSnapshot}
            data={filteredEvents}
            context={{
              languageCode,
              filterStartDate: startDate,
              filterEndDate: endDate,
            }}
            computeItemKey={computeItemKey}
            itemContent={renderFilteredEventListItem}
          />
        </FilteredListWrapper>
      </Container>
    )
  }

  return (
    <Container>
      {dateFilter}
      <GroupedListWrapper $stickyTop={stickyTop}>
        <GroupedVirtuoso
          key='groupedEvents'
          useWindowScroll
          ref={groupedRef}
          restoreStateFrom={groupedSnapshot}
          groupCounts={groupCounts}
          context={{ languageCode, flatEvents, groupTitles, stickyTop }}
          computeItemKey={computeGroupedItemKey}
          groupContent={renderGroupTitles}
          itemContent={renderGroupedEventListItem}
        />
      </GroupedListWrapper>
    </Container>
  )
}

export default EventList
