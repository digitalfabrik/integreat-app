// @flow

import * as React from 'react'
import { useContext } from 'react'
import { connect } from 'react-redux'
import { CityModel, EventModel, NotFoundError } from 'api-client'
import Page, { THUMBNAIL_WIDTH } from '../../../modules/common/components/Page'
import FailureSwitcher from '../../../modules/common/components/FailureSwitcher'
import { withTranslation, TFunction } from 'react-i18next'
import type { StateType } from '../../../modules/app/StateType'
import PageDetail from '../../../modules/common/components/PageDetail'
import EventListItem from '../components/EventListItem'
import List from '../../../modules/common/components/List'
import Caption from '../../../modules/common/components/Caption'
import { push } from 'redux-first-router'
import EventJsonLd from '../../../modules/json-ld/components/EventJsonLd'
import Failure from '../../../modules/common/components/Failure'
import CategoriesRouteConfig from '../../../modules/app/route-configs/CategoriesRouteConfig'
import featuredImageToSrcSet from '../../../modules/common/utils/featuredImageToSrcSet'
import DateFormatterContext from '../../../modules/i18n/context/DateFormatterContext'

type PropsType = {|
  events: Array<EventModel>,
  cities: Array<CityModel>,
  city: string,
  eventId: ?string,
  language: string,
  t: typeof TFunction
|}

/**
 * Displays a list of events or a single event, matching the route /<location>/<language>/events(/<id>)
 */
export const EventsPage = ({
  events,
  eventId,
  city,
  language,
  t,
  cities
}: PropsType) => {
  const formatter = useContext(DateFormatterContext)

  const renderEventListItem = () => (event: EventModel) =>
    <EventListItem event={event} formatter={formatter} key={event.path} />

  const cityModel = cities.find(_cityModel => _cityModel.code === city)
  if (!cityModel || !cityModel.eventsEnabled) {
    return <Failure errorMessage='notFound.category' goToMessage='goTo.categories'
                    goToPath={new CategoriesRouteConfig().getRoutePath({
                      city,
                      language
                    })} />
  }

  if (eventId) {
    const event = events.find(_event => _event.path === `/${city}/${language}/events/${eventId}`)

    if (event) {
      const location = event.location.location
      const defaultThumbnail = event.featuredImage ? event.featuredImage.medium.url : event.thumbnail
      return <>
        <EventJsonLd event={event} formatter={formatter}/>
        <Page defaultThumbnailSrc={defaultThumbnail}
              thumbnailSrcSet={event.featuredImage && featuredImageToSrcSet(event.featuredImage, THUMBNAIL_WIDTH)}
              lastUpdate={event.lastUpdate}
              content={event.content}
              title={event.title}
              formatter={formatter}
              onInternalLinkClick={push}>
          <>
            <PageDetail identifier={t('date')} information={event.date.toFormattedString(formatter)} />
            {location && <PageDetail identifier={t('location')} information={location} />}
          </>
        </Page>
      </>
    } else {
      const error = new NotFoundError({
        type: 'event',
        id: eventId,
        city,
        language
      })
      return <FailureSwitcher error={error} />
    }
  }
  return <>
    <Caption title={t('events')} />
    <List noItemsMessage={t('currentlyNoEvents')}
          items={events}
          renderItem={renderEventListItem()} />
  </>
}

const mapStateTypeToProps = (state: StateType) => ({
  language: state.location.payload.language,
  city: state.location.payload.city,
  eventId: state.location.payload.eventId
})

export default connect<*, *, *, *, *, *>(mapStateTypeToProps)(
  withTranslation('events')(
    EventsPage
  ))
