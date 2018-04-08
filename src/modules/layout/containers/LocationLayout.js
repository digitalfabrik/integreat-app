import * as React from 'react'
import { connect } from 'react-redux'

import CityModel from 'modules/endpoint/models/CityModel'

import GeneralHeader from '../components/GeneralHeader'
import Layout from '../components/Layout'
import GeneralFooter from '../components/GeneralFooter'
import LocationHeader from './LocationHeader'
import LocationFooter from '../components/LocationFooter'
import { CATEGORIES_ROUTE } from '../../app/routes/categories'
import { EVENTS_ROUTE } from '../../app/routes/events'
import { EXTRAS_ROUTE } from '../../app/routes/extras'
import { DISCLAIMER_ROUTE } from '../../app/routes/disclaimer'
import { SEARCH_ROUTE } from '../../app/routes/search'

export const LocationLayoutRoutes = [CATEGORIES_ROUTE, EVENTS_ROUTE, EXTRAS_ROUTE, DISCLAIMER_ROUTE, SEARCH_ROUTE]

type Props = {
  city: string,
  language: string,
  cities: ?Array<CityModel>,
  viewportSmall: boolean,
  children?: Node
}

export class LocationLayout extends React.Component<Props> {
  getCurrentCity (): ?CityModel {
    const cities = this.props.cities
    return cities && cities.find(_city => _city.code === this.props.city)
  }

  render () {
    const {language, city, viewportSmall, children} = this.props
    const cityModel = this.getCurrentCity()

    if (!cityModel) {
      return <Layout header={<GeneralHeader viewportSmall={viewportSmall} />}
                     footer={<GeneralFooter />}>
          {children}
        </Layout>
    }

    return <Layout header={<LocationHeader isEventsEnabled={cityModel.eventsEnabled}
                                           isExtrasEnabled={cityModel.extrasEnabled} />}
                   footer={<LocationFooter city={city}
                                           language={language} />}>
        {children}
      </Layout>
  }
}

const mapStateToProps = state => ({
  city: state.location.payload.city,
  language: state.location.payload.language,
  viewportSmall: state.viewport.is.small,
  cities: state.cities.data
})

export default connect(mapStateToProps)(LocationLayout)
