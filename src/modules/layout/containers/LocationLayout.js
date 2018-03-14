import * as React from 'react'
import { connect } from 'react-redux'

import CityModel from 'modules/endpoint/models/CityModel'
import EventModel from 'modules/endpoint/models/EventModel'

import GeneralHeader from '../components/GeneralHeader'
import Layout from '../components/Layout'
import GeneralFooter from '../components/GeneralFooter'
import LocationHeader from './LocationHeader'
import LocationFooter from '../components/LocationFooter'
import LanguageModel from '../../endpoint/models/LanguageModel'

type Props = {
  city: string,
  language: string,
  cities: Array<CityModel>,
  languages: Array<LanguageModel>,
  currentRoute: string,
  viewportSmall: boolean,
  children?: Node,
  events: Array<EventModel>
}

export class LocationLayout extends React.Component<Props> {
  getCurrentCity (): ?CityModel {
    return this.props.cities.find(_city => _city.code === this.props.city)
  }

  render () {
    const {language, city, currentRoute, viewportSmall, children, events, languages} = this.props
    const cityModel = this.getCurrentCity()
    const isEventsActive = events ? events.length > 0 : false

    if (!cityModel) {
      return <Layout header={<GeneralHeader viewportSmall={viewportSmall} />}
                     footer={<GeneralFooter />}>
          {children}
        </Layout>
    }

    return <Layout header={<LocationHeader viewportSmall={viewportSmall}
                                           location={city}
                                           currentRoute={currentRoute}
                                           language={language}
                                           languages={languages}
                                           isEventsActive={isEventsActive}
                                           isEventsEnabled={cityModel.eventsEnabled}
                                           isExtrasEnabled={cityModel.extrasEnabled} />}
                   footer={<LocationFooter location={city}
                                           language={language} />}>
        {children}
      </Layout>
  }
}

const mapStateToProps = state => ({
  currentRoute: state.location.type,
  city: state.location.payload.city,
  language: state.location.payload.language,
  viewportSmall: state.viewport.is.small,
  cities: state.cities,
  languages: state.languages,
  events: state.events
})

export default connect(mapStateToProps)(LocationLayout)
