import Typography from '@mui/material/Typography'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { useDateFilter, DateGroupKey, groupEventsByDate, EVENT_DATE_GROUPS } from 'shared'
import { EventModel } from 'shared/api'

import EventListItem from '../components/EventListItem'
import EventsDateFilter from '../components/EventsDateFilter'
import List from './base/List'

type EventListProps = {
  events: EventModel[]
  languageCode: string
}

const EventList = ({ events, languageCode }: EventListProps): ReactElement | null => {
  const { t } = useTranslation('events')
  const { startDate, setStartDate, endDate, setEndDate, filteredEvents, startDateError } = useDateFilter(events)

  const groupedEvents = groupEventsByDate(events)

  const groupedListSections = EVENT_DATE_GROUPS.map((key: DateGroupKey) => {
    const dateGroup = groupedEvents[key]
    if (dateGroup.length === 0) {
      return null
    }

    return (
      <section key={key}>
        <Typography component='span' variant='body1' dir='auto'>
          {t(key)}
        </Typography>
        <List
          items={dateGroup.map(event => (
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

  const isGroupedList = EVENT_DATE_GROUPS.some(key => groupedEvents[key].length > 0)

  let eventsList
  if (startDate || endDate) {
    eventsList = filteredListItems
  } else if (isGroupedList) {
    eventsList = groupedListSections
  } else {
    eventsList = <List items={[]} noItemsMessage='events:currentlyNoEvents' />
  }

  return (
    <>
      <EventsDateFilter
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        startDateError={startDateError}
      />
      {eventsList}
    </>
  )
}

export default EventList
