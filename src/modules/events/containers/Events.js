// @flow

import * as React from 'react'

import type { TFunction } from 'react-i18next'
import { EventModel } from '@integreat-app/integreat-api-client'
import Page from '../../../modules/common/components/Page'
import ContentNotFoundError from '../../../modules/common/errors/ContentNotFoundError'
import PageDetail from '../../../modules/common/components/PageDetail'
import EventListItem from '../components/EventListItem'
import List from '../../../modules/common/components/List'
import Caption from '../../../modules/common/components/Caption'
import { Failure } from '../../error/components/Failure'
import type { ThemeType } from '../../theme/constants/theme'

type PropsType = {|
  events: Array<EventModel>,
  city: string,
  language: string,
  t: TFunction,
  path: string,
  theme: ThemeType,
  navigateToEvent: string => void,
  files: { [url: string]: string }
|}

/**
 * Displays a list of events or a single event, matching the route /<location>/<language>/events(/<id>)
 */
export default class Events extends React.Component<PropsType> {
  renderEventListItem = (language: string) => (event: EventModel) =>
    <EventListItem event={event} language={language} key={event.path} />

  render () {
    const {events, path, city, language, files, theme, t} = this.props
    if (path) {
      const event = events.find(_event => _event.path === path)

      if (event) {
        return <>
          <Page content={event.content}
                title={event.title}
                language={language}
                files={files}
                theme={theme}>
            <>
              <PageDetail identifier={t('date')} information={event.date.toFormattedString(language)} />
              <PageDetail identifier={t('location')} information={event.location.location} />
            </>
          </Page>
          </>
      } else {
        const error = new ContentNotFoundError({type: 'event', id: event.id, city, language})
        return <Failure error={error} />
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
