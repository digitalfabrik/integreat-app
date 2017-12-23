import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'
import Spinner from 'react-spinkit'

import EventModel from 'modules/endpoint/models/EventModel'
import EVENTS_ENDPOINT from 'modules/endpoint/endpoints/events'
import LANGUAGES_ENDPOINT from 'modules/endpoint/endpoints/languages'
import withFetcher from 'modules/endpoint/hocs/withFetcher'
import EventDetail from '../components/EventDetail'
import EventList from '../components/EventList'
import { setLanguageChangeUrls } from 'modules/language/actions/setLanguageChangeUrls'
import LanguageModel from 'modules/endpoint/models/LanguageModel'

/**
 * Displays a list of events or a single event, matching the route /<location>/<language>/events(/<id>)
 */
export class EventsPage extends React.Component {
  static propTypes = {
    events: PropTypes.arrayOf(PropTypes.instanceOf(EventModel)).isRequired,
    location: PropTypes.string.isRequired,
    languages: PropTypes.arrayOf(PropTypes.instanceOf(LanguageModel)).isRequired,
    language: PropTypes.string.isRequired,
    dispatchLanguageChangeUrls: PropTypes.func.isRequired,
    id: PropTypes.string
  }

  getPath () {
    return `/${this.props.location}/${this.props.language}/events`
  }

  mapLanguageToUrl = (language, id) =>
    id ? `/${this.props.location}/${language}/events/${id}`
      : `/${this.props.location}/${language}/events`

  findEvent = ((events, id) => events.find(
    (event) => event.id.toString() === id
  ))

  componentDidMount () {
    // all events
    let availableLanguages = {}

    if (this.props.id && this.props.events) {
      // specific event
      const event = this.findEvent(this.props.events, this.props.id)
      if (event) availableLanguages = event.availableLanguages
    }
    this.props.dispatchLanguageChangeUrls(this.mapLanguageToUrl, this.props.languages, availableLanguages)
  }

  // we must not call dispatch in componentWillUpdate or componentDidUpdate
  componentWillReceiveProps (nextProps) {
    if (nextProps.events === this.props.events && nextProps.id === this.props.id) {
      // no relevant prop changes
      return
    }

    if (nextProps.id) {
      // specific event
      const event = this.findEvent(nextProps.events, nextProps.id)
      if (event) {
        // events have been loaded in the new language
        this.props.dispatchLanguageChangeUrls(
          this.mapLanguageToUrl, nextProps.languages, event.availableLanguages
        )
      }
    } else {
      // all events
      this.props.dispatchLanguageChangeUrls(this.mapLanguageToUrl, nextProps.languages)
    }
  }

  render () {
    if (this.props.id) {
      // event with the given id from this.props.path
      const event = this.findEvent(this.props.events, this.props.id)

      if (event) {
        return <EventDetail event={event} location={this.props.location} language={this.props.language} />
      } else {
        // events in new language haven't been fetched yet
        return <Spinner name='line-scale-party' />
      }
    }
    return <EventList events={this.props.events} url={this.getPath()} language={this.props.language} />
  }
}

const mapStateToProps = (state) => ({
  language: state.router.params.language,
  location: state.router.params.location,
  id: state.router.params.id
})

const mapDispatchToProps = (dispatch) => ({
  dispatchLanguageChangeUrls: (urls, languages, availableLanguages) => dispatch(
    setLanguageChangeUrls(urls, languages, availableLanguages)
  )
})

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withFetcher(EVENTS_ENDPOINT),
  withFetcher(LANGUAGES_ENDPOINT)
)(EventsPage)
