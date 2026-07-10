import ListSubheader from '@mui/material/ListSubheader'
import Stack from '@mui/material/Stack'
import { useTheme } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { useDateFilter, groupEventsByDate } from 'shared'
import { EventModel } from 'shared/api'

import EventListItem from '../components/EventListItem'
import EventsDateFilter from '../components/EventsDateFilter'
import { withDividers } from '../utils'
import List from './base/List'

type EventListGroupProps = {
  title: string
  events: EventModel[]
  languageCode: string
}

const EventListGroup = ({ title, events, languageCode }: EventListGroupProps): ReactElement => {
  const theme = useTheme()
  return (
    <Stack paddingBlock={1}>
      <ListSubheader component='h2' style={{ backgroundColor: theme.palette.background.default }}>
        {title}
      </ListSubheader>
      {withDividers(events.map(event => <EventListItem event={event} languageCode={languageCode} key={event.path} />))}
    </Stack>
  )
}

type EventListProps = {
  events: EventModel[]
  languageCode: string
}

const EventList = ({ events, languageCode }: EventListProps): ReactElement | null => {
  const { t } = useTranslation('events')
  const { startDate, setStartDate, endDate, setEndDate, filteredEvents, startDateError } = useDateFilter(events)

  const dateFilter = (
    <EventsDateFilter
      startDate={startDate}
      setStartDate={setStartDate}
      endDate={endDate}
      setEndDate={setEndDate}
      startDateError={startDateError}
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
          noItemsMessage='events:currentlyNoEvents'
        />
      </>
    )
  }

  const dateGroups = groupEventsByDate(events).map(([key, events]) => (
    <EventListGroup key={key} title={t(key)} events={events} languageCode={languageCode} />
  ))

  return (
    <>
      {dateFilter}
      <List items={dateGroups} noItemsMessage='events:currentlyNoEvents' showDividers={false} />
    </>
  )
}

export default EventList
