import * as React from 'react'
import { connect } from 'react-redux'

import LocationModel from 'modules/endpoint/models/LocationModel'
import EventModel from 'modules/endpoint/models/EventModel'

import GeneralHeader from '../components/GeneralHeader'
import Layout from '../components/Layout'
import GeneralFooter from '../components/GeneralFooter'
import LocationHeader from './LocationHeader'
import LocationFooter from '../components/LocationFooter'
import LanguageModel from '../../endpoint/models/LanguageModel'

type Props = {
  location: string,
  language: string,
  locations: Array<LocationModel>,
  languages: Array<LanguageModel>,
  currentRoute: string,
  viewportSmall: boolean,
  children?: Node,
  events: Array<EventModel>
}

export class LocationLayout extends React.Component<Props> {
  getCurrentLocation (): ?LocationModel {
    return this.props.locations.find(location => location.code === this.props.location)
  }

  render () {
    const {language, location, currentRoute, viewportSmall, children, events, languages} = this.props
    const locationModel = this.getCurrentLocation()
    const isEventsActive = events ? events.length > 0 : false

    if (!locationModel) {
      return <Layout header={<GeneralHeader viewportSmall={viewportSmall} />}
                     footer={<GeneralFooter />}>
          {children}
        </Layout>
    }

    return <Layout header={<LocationHeader viewportSmall={viewportSmall}
                                           location={location}
                                           currentRoute={currentRoute}
                                           language={language}
                                           languages={languages}
                                           isEventsActive={isEventsActive}
                                           isEventsEnabled={locationModel.eventsEnabled}
                                           isExtrasEnabled={locationModel.extrasEnabled} />}
                   footer={<LocationFooter location={location}
                                           language={language} />}>
        {children}
      </Layout>
  }
}

const mapStateToProps = state => ({
  currentRoute: state.location.type,
  location: state.location.payload.location,
  language: state.location.payload.language,
  viewportSmall: state.viewport.is.small,
  locations: state.locationModels,
  languages: state.languages,
  events: state.events
})

export default connect(mapStateToProps)(LocationLayout)
