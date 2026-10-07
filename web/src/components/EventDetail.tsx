import LinkIcon from '@mui/icons-material/Link'
import LocationIcon from '@mui/icons-material/LocationOnOutlined'
import { styled } from '@mui/material/styles'
import { DateTime } from 'luxon'
import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { EventModel } from 'shared/api'

import { EVENTS_VISITED_IDS_STORAGE_KEY } from '../hooks/useLocalStorage'
import useVisitedIds from '../hooks/useVisitedIds'
import featuredImageToSrcSet from '../utils/featuredImageToSrcSet'
import EventDates from './EventDates'
import ExportEventButton from './ExportEventButton'
import NewChip from './NewChip'
import Page, { THUMBNAIL_WIDTH } from './Page'
import PageDetail from './PageDetail'

const Spacing = styled('div')<{ content: string; lastUpdate?: DateTime }>`
  display: flex;
  flex-direction: column;
  padding-top: 12px;
  padding-bottom: ${props => (props.content.length > 0 && props.lastUpdate ? '0px' : '12px')};
  gap: 8px;
`

const StyledNewChip = styled(NewChip)(({ theme }) => ({
  alignSelf: 'flex-end',
  marginTop: 12,

  [theme.breakpoints.up('md')]: {
    alignSelf: 'flex-start',
    marginTop: 16,
  },
}))

type EventDetailProps = {
  event: EventModel
  languageCode: string
  regionCode: string
}

const EventDetail = ({ event, languageCode, regionCode }: EventDetailProps): ReactElement => {
  const [visitedEventIds, addVisitedEventId] = useVisitedIds({ key: EVENTS_VISITED_IDS_STORAGE_KEY, regionCode })
  const [visited] = useState(visitedEventIds.includes(event.id.toString()))
  const { t } = useTranslation()

  useEffect(() => {
    addVisitedEventId(event.id.toString())
  }, [event.id, addVisitedEventId])

  return (
    <Page
      thumbnailSrcSet={event.featuredImage ? featuredImageToSrcSet(event.featuredImage, THUMBNAIL_WIDTH) : undefined}
      lastUpdate={event.lastUpdate}
      content={event.content}
      title={event.title}
      titleAdornment={event.isNew && !visited ? <StyledNewChip /> : undefined}
      beforeContent={
        <Spacing content={event.content} lastUpdate={event.lastUpdate}>
          <EventDates event={event} languageCode={languageCode} />
          {event.location && (
            <PageDetail
              tooltip={t($ => $.common.contacts.address.title)}
              icon={<LocationIcon />}
              information={event.location.fullAddress}
              path={event.placePath}
            />
          )}
          {!!event.meetingUrl && (
            <PageDetail
              tooltip={t($ => $.events.onlineMeeting)}
              icon={<LinkIcon />}
              information={event.meetingUrl}
              path={event.meetingUrl}
            />
          )}
        </Spacing>
      }
      footer={<ExportEventButton event={event} />}
    />
  )
}

export default EventDetail
