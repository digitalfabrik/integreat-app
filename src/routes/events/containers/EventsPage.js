import React from 'react'
import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'
import Spinner from 'react-spinkit'

import withFetcher from 'modules/endpoint/hocs/withFetcher'
import EventDetail from '../components/EventDetail'
import EventList from '../components/EventList'
import setLanguageChangeUrls from 'modules/language/actions/setLanguageChangeUrls'
import LanguageModel from 'modules/endpoint/models/LanguageModel'
import type { EventType } from '../../../modules/endpoint/types'

type mapLanguageToPath = (string, ?string) => string

type Props = {
  events: Array<EventType>,
  location: string,
  languages: Array<LanguageModel>,
  language: string,
  setLanguageChangeUrls: (mapLanguageToPath, Array<LanguageModel>, any) => {},
  id?: string
}

/**
 * Displays a list of events or a single event, matching the route /<location>/<language>/events(/<id>)
 */
export class EventsPage extends React.Component<Props> {
  getPath () {
    return `/${this.props.location}/${this.props.language}/events`
  }

  /**
   * The function used to map different languages to their EventsPages
   * @param {string} language The language
   * @param {string | undefined} id The id of a single event
   * @returns {string} The path of the EventsPage of a different language
   */
  mapLanguageToPath = (language, id) =>
    id ? `/${this.props.location}/${language}/events/${id}`
      : `/${this.props.location}/${language}/events`

  /**
   * Finds the event in events with the given id
   * @param {Array<EventType>} events The events to search
   * @param {string} id The id of the event to search for
   */
  findEvent = (events, id) => events.find(
    event => event.id.toString() === id
  )

  /**
   * Dispatches the action to set the language change urls after mount
   */
  componentDidMount () {
    // all events
    let availableLanguages = {}

    if (this.props.id && this.props.events) {
      // only a specific event
      const event = this.findEvent(this.props.events, this.props.id)
      if (event) {
        availableLanguages = event.availableLanguages
      }
    }
    this.props.setLanguageChangeUrls(this.mapLanguageToPath, this.props.languages, availableLanguages)
  }

  /**
   * Dispatches the action to set the language change urls after a prop change
   * (i.e. language change, selection of a specific event)
   * we must NOT call dispatch in componentWillUpdate or componentDidUpdate
   * @see https://reactjs.org/docs/react-component.html#componentwillupdate
   * @param nextProps The new props
   */
  componentWillReceiveProps (nextProps) {
    if (nextProps.events === this.props.events && nextProps.id === this.props.id) {
      // no relevant prop changes
      return
    }

    if (nextProps.id) {
      // only a specific event
      const event = this.findEvent(nextProps.events, nextProps.id)
      if (event) {
        // events have been loaded in the new language
        this.props.setLanguageChangeUrls(
          this.mapLanguageToPath, nextProps.languages, event.availableLanguages
        )
      }
    } else {
      // all events
      this.props.setLanguageChangeUrls(this.mapLanguageToPath, nextProps.languages)
    }
  }

  render () {
    if (this.props.id) {
      // event with the given id from this.props.id
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

const mapStateToProps = state => ({
  language: state.router.params.language,
  location: state.router.params.location,
  id: state.router.params.id
})

const mapDispatchToProps = dispatch => ({
  setLanguageChangeUrls: (mapLanguageToPath, languages, availableLanguages) => dispatch(
    setLanguageChangeUrls(mapLanguageToPath, languages, availableLanguages)
  )
})

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withFetcher('events'),
  withFetcher('languages')
)(EventsPage)
