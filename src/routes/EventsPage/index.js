import React from 'react'
import PropTypes from 'prop-types'

import RichLayout from 'components/RichLayout'
import Events from '../../components/Content/Events'
import EventModel from 'endpoints/models/EventModel'
import LANGUAGE_ENDPOINT from 'endpoints/language'
import EVENTS_ENDPOINT from 'endpoints/events'
import LanguageModel from '../../endpoints/models/LanguageModel'
import { setCurrentAvailableLanguages } from 'actions'
import withFetcher from 'endpoints/withFetcher'
import compose from 'redux/es/compose'
import connect from 'react-redux/es/connect/connect'

class ContentWrapper extends React.Component {
  static propTypes = {
    /**
     * from withFetcher HOC which provides data from EVENTS_ENDPOINT
     */
    events: PropTypes.arrayOf(PropTypes.instanceOf(EventModel)).isRequired,
    languages: PropTypes.arrayOf(PropTypes.instanceOf(LanguageModel)),
    location: PropTypes.string
  }

  componentDidMount () {
    this.updateAvailableLanguages()
  }

  updateAvailableLanguages () {
    const redirect = (language) => `/${this.props.location}/${language}/events`
    const currentAvailableLanguages = this.props.languages.reduce((acc, language) => Object.assign(acc, { [language.code]: redirect(language.code) }), {})
    this.props.dispatch(setCurrentAvailableLanguages(currentAvailableLanguages))
  }

  render () {
    return <Events events={this.props.events}/>
  }
}

const mapStateToProps = (state) => ({ location: state.router.params.location })

const FetchingContentWrapper = compose(
  withFetcher(EVENTS_ENDPOINT),
  withFetcher(LANGUAGE_ENDPOINT),
  connect(mapStateToProps)
)(ContentWrapper)

class EventsPage extends React.Component {
  render () {
    return (
      <RichLayout>
        <FetchingContentWrapper/>
      </RichLayout>
    )
  }
}

export default EventsPage
