import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { Link } from 'redux-little-router'
import { Row } from 'react-flexbox-grid'
import { isEmpty } from 'lodash/lang'
import FontAwesome from 'react-fontawesome'
import normalizeUrl from 'normalize-url'

import EventModel from 'endpoints/models/EventModel'
import Navigation from 'Navigation'
import Hierarchy from 'routes/LocationPage/Hierarchy'

import EVENTS_ENDPOINT from 'endpoints/events'
import withFetcher from 'endpoints/withFetcher'

import Page from './Page'
import Categories from './Categories'
import style from './index.css'
import TitledContentList from './TitledContentList'

class Content extends React.Component {
  static propTypes = {
    events: PropTypes.arrayOf(PropTypes.instanceOf(EventModel)), // From withFetcher
    hierarchy: PropTypes.instanceOf(Hierarchy),
    url: PropTypes.string.isRequired
  }

  hasEvents () {
    return !isEmpty(this.props.events)
  }

  // TODO: Refactor this to event component...
  getEventSnippet () {
    const nav = new Navigation(this.props.location, this.props.language)
    const t = this.props.t
    return <Link className={style.events} href={nav.events}>
      <FontAwesome name="calendar" className={style.calendarIcon}/>
      <div className={style.eventsContainer}>
        <div><strong>{t('common:currentEvents')}:</strong></div>
        {this.props.events.slice(0, 2).map((event) => <div key={event.id} className={style.event}>{event.title}</div>)}
        {this.props.events.length > 2 ? <div className={style.event}><em>{t('common:AndMore')}</em></div> : ''}
      </div>
    </Link>
  }

  render () {
    const t = this.props.t
    const hierarchy = this.props.hierarchy
    const page = hierarchy.top()

    if (isEmpty(page.children)) {
      return <Page page={page}/>
    }

    const url = normalizeUrl(this.props.url, {removeTrailingSlash: true})
    const base = url + hierarchy.path()

    const pages = page.children.map((page) => ({page, url: `${base}/${page.id}`}))

    if (hierarchy.root()) {
      return <div>
        {this.hasEvents() ? this.getEventSnippet() : ''}
        <Categories pages={pages}/>
        {!this.hasEvents() ? <Row className={style.noEvents}>{t('common:thereAreCurrentlyNoEvents')}</Row> : ''}
      </div>
    } else {
      return <TitledContentList parentPage={page} pages={pages}/>
    }
  }
}

function mapStateToProps (state) {
  return {
    language: state.router.params.language,
    location: state.router.params.location
  }
}

export default connect(mapStateToProps)(translate('common', 'errors')(withFetcher(EVENTS_ENDPOINT)(Content)))
