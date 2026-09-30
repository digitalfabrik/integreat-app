import React, { ReactElement } from 'react'
import { RefreshControl } from 'react-native'

import { RouteInformationType } from 'shared'
import { EventModel, fromError, NotFoundError, RegionModel } from 'shared/api'

import EventDetail from '../components/EventDetail'
import EventList from '../components/EventList'
import Failure from '../components/Failure'
import LayoutedScrollView from '../components/LayoutedScrollView'
import useTtsPlayer from '../hooks/useTtsPlayer'

type EventsProps = {
  slug?: string
  events: EventModel[]
  regionModel: RegionModel
  language: string
  navigateTo: (routeInformation: RouteInformationType) => void
  refresh: () => void
}

const Events = ({ regionModel, language, navigateTo, events, slug, refresh }: EventsProps): ReactElement => {
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
          <EventDetail key={event.id} event={event} language={language} regionCode={regionModel.code} />
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
