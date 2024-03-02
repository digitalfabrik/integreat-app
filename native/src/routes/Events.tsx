import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { RefreshControl } from 'react-native'
import styled from 'styled-components/native'

import { EVENTS_ROUTE, RouteInformationType } from 'shared'
import { fromError, NotFoundError, CityModel, EventModel } from 'shared/api'

import Caption from '../components/Caption'
import DatesPageDetail from '../components/DatesPageDetail'
import EventListItem from '../components/EventListItem'
import ExportEventButton from '../components/ExportEventButton'
import Failure from '../components/Failure'
import Layout from '../components/Layout'
import LayoutedScrollView from '../components/LayoutedScrollView'
import List from '../components/List'
import Page from '../components/Page'
import PageDetail from '../components/PageDetail'

const ListContainer = styled(Layout)`
  padding: 0 8px;
`

const Separator = styled.View`
  border-top-width: 2px;
  border-top-color: ${props => props.theme.colors.themeColor};
`

const PageDetailsContainer = styled.View`
  gap: 8px;
`

export type EventsProps = {
  slug?: string
  events: Array<EventModel>
  cityModel: CityModel
  language: string
  navigateTo: (routeInformation: RouteInformationType) => void
  refresh: () => void
}

const Events = ({ cityModel, language, navigateTo, events, slug, refresh }: EventsProps): ReactElement => {
  const { t } = useTranslation('events')

  if (!cityModel.eventsEnabled) {
    const error = new NotFoundError({
      type: 'category',
      id: 'events',
      city: cityModel.code,
      language,
    })
    return (
      <LayoutedScrollView refreshControl={<RefreshControl onRefresh={refresh} refreshing={false} />}>
        <Failure code={fromError(error)} />
      </LayoutedScrollView>
    )
  }

  if (slug) {
    const event = events.find(it => it.slug === slug)

    if (event) {
      return (
        <LayoutedScrollView refreshControl={<RefreshControl onRefresh={refresh} refreshing={false} />}>
          <Page
            content={event.content}
            title={event.title}
            lastUpdate={event.lastUpdate}
            language={language}
            path={event.path}
            BeforeContent={
              <PageDetailsContainer>
                <DatesPageDetail date={event.date} languageCode={language} />
                {event.location && (
                  <PageDetail identifier={t('address')} information={event.location.fullAddress} language={language} />
                )}
              </PageDetailsContainer>
            }
            Footer={<ExportEventButton event={event} />}
          />
        </LayoutedScrollView>
      )
    }

    const error = new NotFoundError({
      type: 'event',
      id: slug,
      city: cityModel.code,
      language,
    })
    return <Failure code={fromError(error)} />
  }

  const renderEventListItem = ({ item }: { item: EventModel }) => {
    const navigateToEvent = () =>
      navigateTo({
        route: EVENTS_ROUTE,
        cityCode: cityModel.code,
        languageCode: language,
        slug: item.slug,
      })
    return <EventListItem key={item.slug} event={item} language={language} navigateToEvent={navigateToEvent} />
  }

  return (
    <ListContainer>
      <List
        items={events}
        renderItem={renderEventListItem}
        Header={
          <>
            <Caption title={t('events')} />
            <Separator />
          </>
        }
        refresh={refresh}
        noItemsMessage={t('currentlyNoEvents')}
      />
    </ListContainer>
  )
}

export default Events
