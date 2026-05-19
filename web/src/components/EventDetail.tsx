import LinkIcon from '@mui/icons-material/Link'
import LocationIcon from '@mui/icons-material/LocationOnOutlined'
import { styled } from '@mui/material/styles'
import { DateTime } from 'luxon'
import React, { ReactElement, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { EventModel } from 'shared/api'

import useLocalStorage, { EVENTS_VISITED_IDS_STORAGE_KEY } from '../hooks/useLocalStorage'
import featuredImageToSrcSet from '../utils/featuredImageToSrcSet'
import DatesPageDetail from './DatesPageDetail'
import ExportEventButton from './ExportEventButton'
import Page, { THUMBNAIL_WIDTH } from './Page'
import PageDetail from './PageDetail'

const Spacing = styled('div')<{ content: string; lastUpdate?: DateTime }>`
  display: flex;
  flex-direction: column;
  padding-top: 12px;
  padding-bottom: ${props => (props.content.length > 0 && props.lastUpdate ? '0px' : '12px')};
  gap: 8px;
`

type EventDetailProps = {
  event: EventModel
  languageCode: string
}

const EventDetail = ({ event, languageCode }: EventDetailProps): ReactElement => {
  const { updateLocalStorageItem: updateVisitedEventIds } = useLocalStorage<number[]>({
    key: EVENTS_VISITED_IDS_STORAGE_KEY,
    initialValue: [],
  })
  const { t } = useTranslation('events')

  useEffect(() => {
    updateVisitedEventIds(oldValue => (oldValue.includes(event.id) ? oldValue : [...oldValue, event.id]))
  }, [event, updateVisitedEventIds])

  return (
    <Page
      thumbnailSrcSet={event.featuredImage ? featuredImageToSrcSet(event.featuredImage, THUMBNAIL_WIDTH) : undefined}
      lastUpdate={event.lastUpdate}
      content={event.content}
      title={event.title}
      BeforeContent={
        <Spacing content={event.content} lastUpdate={event.lastUpdate}>
          <DatesPageDetail date={event.date} language={languageCode} />
          {event.location && (
            <PageDetail
              tooltip={t('address')}
              icon={<LocationIcon />}
              information={event.location.fullAddress}
              path={event.poiPath}
            />
          )}
          {!!event.meetingUrl && (
            <PageDetail
              tooltip={t('meetingUrl')}
              icon={<LinkIcon />}
              information={event.meetingUrl}
              path={event.meetingUrl}
            />
          )}
        </Spacing>
      }
      Footer={<ExportEventButton event={event} />}
    />
  )
}

export default EventDetail
