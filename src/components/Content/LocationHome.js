import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { Link } from 'redux-little-router'
import { Row } from 'react-flexbox-grid'
import { isEmpty } from 'lodash/lang'
import FontAwesome from 'react-fontawesome'

import PageModel from '../../endpoints/models/PageModel'
import { EventsFetcher } from '../../endpoints'
import EventModel from '../../endpoints/models/EventModel'
import Navigation from '../../Navigation'
import style from './LocationHome.css'
import Categories from './Categories'

const LocationHomeAdapter = connect((state) => ({ language: state.router.params.language, location: state.router.params.location }))(translate('common')(
  class extends React.Component {
    static propTypes = {
      parentPage: PropTypes.instanceOf(PageModel).isRequired,
      categories: PropTypes.arrayOf(PropTypes.shape({
        page: PropTypes.instanceOf(PageModel).isRequired,
        url: PropTypes.string.isRequired
      })).isRequired,
      events: PropTypes.arrayOf(PropTypes.instanceOf(EventModel)).isRequired
    }

    hasEvents () {
      return !isEmpty(this.props.events)
    }

    getEventSnippet () {
      const nav = new Navigation(this.props.location, this.props.language)
      const t = this.props.t
      return <Link className={style.events} href={nav.events}>
          <FontAwesome name="calendar" className={style.calendarIcon}/>
          <div className={style.eventsContainer}>
            <div><strong>{t('common:currentEvents')}:</strong></div>
            { this.props.events.slice(0, 2).map((event) => <div key={event.id} className={style.event}>{ event.title }</div>) }
            { this.props.events.length > 2 ? <div className={style.event}><em>{t('common:AndMore')}</em></div> : '' }
          </div>
      </Link>
    }

    render () {
      const t = this.props.t
      return <div>
        { this.hasEvents() ? this.getEventSnippet() : '' }
        <Categories categories={this.props.categories}/>
        { !this.hasEvents() ? <Row className={style.noEvents}>{t('common:thereAreCurrentlyNoEvents')}</Row> : '' }
      </div>
    }
  }))

export default class LocationHome extends React.Component {
  static propTypes = {
    parentPage: PropTypes.instanceOf(PageModel).isRequired,
    categories: PropTypes.arrayOf(PropTypes.shape({
      page: PropTypes.instanceOf(PageModel).isRequired,
      url: PropTypes.string.isRequired
    })).isRequired
  }

  render () {
    return (
      <EventsFetcher>
        <LocationHomeAdapter categories={ this.props.categories } parentPage={ this.props.parentPage }/>
      </EventsFetcher>
    )
  }
}
