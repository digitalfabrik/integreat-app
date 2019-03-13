// @flow

import * as React from 'react'
import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'

import { EventModel } from '@integreat-app/integreat-api-client'
import Page from '../../../modules/common/components/Page'
import ContentNotFoundError from '../../../modules/common/errors/ContentNotFoundError'
import FailureSwitcher from '../../../modules/common/components/FailureSwitcher'
import type { TFunction } from 'react-i18next'
import { withTranslation } from 'react-i18next'
import type { StateType } from '../../../modules/app/StateType'
import PageDetail from '../../../modules/common/components/PageDetail'
import EventListItem from '../components/EventListItem'
import List from '../../../modules/common/components/List'
import Caption from '../../../modules/common/components/Caption'
import { push } from 'redux-first-router'

type PropsType = {|
  events: Array<EventModel>,
  city: string,
  eventId: ?string,
  language: string,
  t: TFunction,
  path: string
|}

/**
 * Displays a list of events or a single event, matching the route /<location>/<language>/events(/<id>)
 */
export class EventsPage extends React.Component<PropsType> {
  renderEventListItem = (language: string) => (event: EventModel) =>
    <EventListItem event={event} language={language} key={event.path} />

  render () {
    const {events, path, eventId, city, language, t} = this.props
    if (eventId) {
      const event = events.find(_event => _event.path === path)

      if (event) {
        return <>
          <Page thumbnail={event.thumbnail}
                lastUpdate={event.lastUpdate}
                content={event.content}
                title={event.title}
                language={language}
                onInternalLinkClick={push}>
            <>
              <PageDetail identifier={t('date')} information={event.date.toFormattedString(language)} />
              <PageDetail identifier={t('location')} information={event.location.location} />
            </>
          </Page>
        </>
      } else {
        const error = new ContentNotFoundError({type: 'event', id: eventId, city, language})
        return <FailureSwitcher error={error} />
      }
    }
    return <>
      <Caption title={t('news')} />
      <List noItemsMessage={t('currentlyNoEvents')}
            items={events}
            renderItem={this.renderEventListItem(language)} />
    </>
  }
}

const mapStateTypeToProps = (state: StateType) => ({
  language: state.location.payload.language,
  city: state.location.payload.city,
  eventId: state.location.payload.eventId,
  path: state.location.pathname
})

export default compose(
  connect(mapStateTypeToProps),
  withTranslation('events')
)(EventsPage)
