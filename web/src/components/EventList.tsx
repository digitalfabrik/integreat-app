import Stack from '@mui/material/Stack'
import React, { ReactElement, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { groupEventsByDate, eventGroupTitle } from 'shared'
import { EventModel } from 'shared/api'

import EventListItem from '../components/EventListItem'
import EventsDateFilter from '../components/EventsDateFilter'
import useDateFilter from '../hooks/useDateFilter'
import { withDividers } from '../utils'
import List, { StickyListSubheader } from './base/List'

type EventListProps = {
  events: EventModel[]
  languageCode: string
}

const EventGroupList = ({ events, languageCode }: EventListProps): ReactElement | null => {
  const { t } = useTranslation()

  const dateGroups = useMemo(
    () =>
      groupEventsByDate(events).map(([key, groupedEvents]) => {
        const [titleKey, params] = eventGroupTitle(key)
        const title = t($ => $.events.dateGroups[titleKey], params)
        return (
          <Stack key={key} sx={{ paddingBlock: 1 }}>
            <StickyListSubheader component='h2'>{title}</StickyListSubheader>
            {withDividers(
              groupedEvents.map(event => <EventListItem event={event} languageCode={languageCode} key={event.path} />),
            )}
          </Stack>
        )
      }),
    [events, languageCode, t],
  )

  return <List items={dateGroups} noItemsMessage={t($ => $.events.error.nothingFound)} showDividers={false} />
}

const EventList = ({ events, languageCode }: EventListProps): ReactElement | null => {
  const { t } = useTranslation()
  const { startDate, setStartDate, endDate, setEndDate, filteredEvents, startDateError, resetDates } =
    useDateFilter(events)

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

  if (startDate || endDate) {
    return (
      <>
        {dateFilter}
        <List
          items={filteredEvents.map(event => (
            <EventListItem
              event={event}
              languageCode={languageCode}
              key={event.path}
              filterStartDate={startDate}
              filterEndDate={endDate}
            />
          ))}
          noItemsMessage={t($ => $.events.error.nothingFound)}
        />
      </>
    )
  }

  return (
    <>
      {dateFilter}
      <EventGroupList events={events} languageCode={languageCode} />
    </>
  )
}

export default EventList
