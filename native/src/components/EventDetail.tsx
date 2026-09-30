import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import { EventModel } from 'shared/api'

import { contentAlignment } from '../constants/contentDirection'
import useVisitedIds from '../hooks/useVisitedIds'
import EventDates from './EventDates'
import ExportEventButton from './ExportEventButton'
import NewChip from './NewChip'
import Page from './Page'
import PageDetail from './PageDetail'

const PageDetailsContainer = styled.View`
  gap: 8px;
`

type EventDetailProps = {
  event: EventModel
  language: string
  regionCode: string
}

const EventDetail = ({ event, language, regionCode }: EventDetailProps): ReactElement => {
  const { t } = useTranslation()
  const [visitedEventIds, addVisitedEventId] = useVisitedIds({ key: 'visitedEventIds', regionCode })
  const [visited] = useState(visitedEventIds.includes(event.id.toString()))

  const alignment = contentAlignment(language) === 'right' ? 'flex-start' : 'flex-end'

  useEffect(() => {
    addVisitedEventId(event.id.toString())
  }, [event, addVisitedEventId])

  return (
    <Page
      content={event.content}
      title={event.title}
      beforeTitle={event.isNew && !visited ? <NewChip style={{ alignSelf: alignment }} /> : undefined}
      lastUpdate={event.lastUpdate}
      language={language}
      beforeContent={
        <PageDetailsContainer>
          <EventDates event={event} language={language} />
          {event.location && (
            <PageDetail
              icon='map-marker-outline'
              information={event.location.fullAddress}
              language={language}
              path={event.placePath}
              accessibilityLabel={t($ => $.common.contacts.address.title)}
            />
          )}
          {event.meetingUrl !== null && (
            <PageDetail
              icon='link-outline'
              isExternalUrl
              information={event.meetingUrl}
              language={language}
              path={event.meetingUrl}
              accessibilityLabel={t($ => $.events.onlineMeeting)}
            />
          )}
        </PageDetailsContainer>
      }
      footer={<ExportEventButton event={event} />}
    />
  )
}

export default EventDetail
