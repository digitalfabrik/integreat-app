import ListSubheader from '@mui/material/ListSubheader'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import React, { ElementType, ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { useDateFilter, groupEventsByDate } from 'shared'
import { EventModel } from 'shared/api'

import EventListItem from '../components/EventListItem'
import EventsDateFilter from '../components/EventsDateFilter'
import useDimensions from '../hooks/useDimensions'
import { withDividers } from '../utils'
import List from './base/List'

const StyledListSubheader = styled(ListSubheader, { shouldForwardProp: prop => prop !== 'stickyTop' })<{
  stickyTop: number
  component?: ElementType
}>(({ theme, stickyTop }) => ({
  backgroundColor: theme.palette.background.default,
  top: stickyTop,
  transition: 'top 0.2s ease-out',
}))

type EventListGroupProps = {
  title: string
  events: EventModel[]
  languageCode: string
}

const EventListGroup = ({ title, events, languageCode }: EventListGroupProps): ReactElement => {
  const { stickyTop } = useDimensions()
  return (
    <Stack paddingBlock={1}>
      <StyledListSubheader component='h2' stickyTop={stickyTop}>
        {title}
      </StyledListSubheader>
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
