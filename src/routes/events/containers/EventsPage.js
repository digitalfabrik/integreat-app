import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import EventModel from 'modules/endpoint/models/EventModel'
import EventDetail from '../components/EventDetail'
import EventList from '../components/EventList'
import setLanguageChangeUrls from 'modules/language/actions/setLanguageChangeUrls'
import LanguageModel from 'modules/endpoint/models/LanguageModel'
import Failure from '../../../modules/common/components/Failure'

/**
 * Displays a list of events or a single event, matching the route /<location>/<language>/events(/<id>)
 */
export class EventsPage extends React.Component {
  static propTypes = {
    events: PropTypes.arrayOf(PropTypes.instanceOf(EventModel)).isRequired,
    location: PropTypes.string.isRequired,
    languages: PropTypes.arrayOf(PropTypes.instanceOf(LanguageModel)).isRequired,
    language: PropTypes.string.isRequired,
    setLanguageChangeUrls: PropTypes.func.isRequired,
    id: PropTypes.string
  }

  /**
   * Generates the current url
   * @returns {string} The url
   */
  getUrl () {
    return `/${this.props.location}/${this.props.language}/events`
  }

  /**
   * The function used to map different languages to their EventsPages
   * @param {string} language The language
   * @param {string | undefined} id The id of a single event
   * @returns {string} The url of the EventsPage of a different language
   */
  mapLanguageToUrl = (language, id) =>
    id ? `/${this.props.location}/${language}/events/${id}`
      : `/${this.props.location}/${language}/events`

  /**
   * Finds the event in events with the given id
   * @param {Array.<EventModel>} events The events to search
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
    this.props.setLanguageChangeUrls(this.mapLanguageToUrl, this.props.languages, availableLanguages)
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
          this.mapLanguageToUrl, nextProps.languages, event.availableLanguages
        )
      }
    } else {
      // all events
      this.props.setLanguageChangeUrls(this.mapLanguageToUrl, nextProps.languages)
    }
  }

  render () {
    if (this.props.id) {
      // event with the given id from this.props.id
      const event = this.findEvent(this.props.events, this.props.id)

      if (event) {
        return <EventDetail event={event} location={this.props.location} language={this.props.language} />
      } else {
        return <Failure />
      }
    }
    return <EventList events={this.props.events} url={this.getUrl()} language={this.props.language} />
  }
}

const mapStateToProps = state => ({
  language: state.router.params.language,
  location: state.router.params.location,
  id: state.router.params.id
})

const mapDispatchToProps = dispatch => ({
  setLanguageChangeUrls: (urls, languages, availableLanguages) => dispatch(
    setLanguageChangeUrls(urls, languages, availableLanguages)
  )
})

export default connect(mapStateToProps, mapDispatchToProps)(EventsPage)
