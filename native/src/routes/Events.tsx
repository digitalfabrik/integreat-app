import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { RefreshControl } from 'react-native'
import styled from 'styled-components/native'

import { RouteInformationType } from 'shared'
import { EventModel, fromError, NotFoundError, RegionModel } from 'shared/api'

import DatesPageDetail from '../components/DatesPageDetail'
import EventList from '../components/EventList'
import ExportEventButton from '../components/ExportEventButton'
import Failure from '../components/Failure'
import LayoutedScrollView from '../components/LayoutedScrollView'
import Page from '../components/Page'
import PageDetail from '../components/PageDetail'
import useTtsPlayer from '../hooks/useTtsPlayer'

const PageDetailsContainer = styled.View`
  gap: 8px;
`

type EventsProps = {
  slug?: string
  events: EventModel[]
  regionModel: RegionModel
  language: string
  navigateTo: (routeInformation: RouteInformationType) => void
  refresh: () => void
}

const Events = ({ regionModel, language, navigateTo, events, slug, refresh }: EventsProps): ReactElement => {
  const { t } = useTranslation('events')
  const event = events.find(it => it.slug === slug)
  useTtsPlayer(event)

  if (!regionModel.eventsEnabled) {
    const error = new NotFoundError({
      type: 'category',
      id: 'events',
      region: regionModel.code,
      language,
    })
    return (
      <LayoutedScrollView refreshControl={<RefreshControl onRefresh={refresh} refreshing={false} />}>
        <Failure code={fromError(error)} retry={refresh} />
      </LayoutedScrollView>
    )
  }

  if (slug) {
    if (event) {
      return (
        <LayoutedScrollView refreshControl={<RefreshControl onRefresh={refresh} refreshing={false} />}>
          <Page
            content={event.content}
            title={event.title}
            lastUpdate={event.lastUpdate}
            language={language}
            beforeContent={
              <PageDetailsContainer>
                <DatesPageDetail date={event.date} languageCode={language} />
                {event.location && (
                  <PageDetail
                    icon='map-marker'
                    information={event.location.fullAddress}
                    language={language}
                    path={event.placePath}
                    accessibilityLabel={t('address')}
                  />
                )}
                {event.meetingUrl !== null && (
                  <PageDetail
                    icon='link'
                    isExternalUrl
                    information={event.meetingUrl}
                    language={language}
                    path={event.meetingUrl}
                    accessibilityLabel={t('meetingUrl')}
                  />
                )}
              </PageDetailsContainer>
            }
            footer={<ExportEventButton event={event} />}
          />
        </LayoutedScrollView>
      )
    }

    const error = new NotFoundError({
      type: 'event',
      id: slug,
      region: regionModel.code,
      language,
    })

    return <Failure code={fromError(error)} retry={refresh} />
  }

  return (
    <EventList
      events={events}
      regionModel={regionModel}
      language={language}
      navigateTo={navigateTo}
      refresh={refresh}
    />
  )
}

export default Events
