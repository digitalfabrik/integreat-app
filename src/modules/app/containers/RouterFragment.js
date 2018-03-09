import { Fragment } from 'redux-little-router'
import React from 'react'

import Layout from 'modules/layout/components/Layout'
import GeneralHeader from '../../layout/components/GeneralHeader'
import GeneralFooter from '../../layout/components/GeneralFooter'
import MainDisclaimerPage from 'routes/main-disclaimer/components/MainDisclaimerPage'
import LandingPage from 'routes/landing/containers/LandingPage'
import I18nRedirect from 'modules/app/containers/I18nRedirect'
import PropTypes from 'prop-types'
import RouteConfig from '../RouteConfig'
import { connect } from 'react-redux'
import LocationFragment from './LocationFragment'
import LocationModel from '../../endpoint/models/LocationModel'

const LANGUAGE_CODE_LENGTH = 2

export class RouterFragment extends React.Component {
  static propTypes = {
    viewportSmall: PropTypes.bool.isRequired,
    routeConfig: PropTypes.instanceOf(RouteConfig).isRequired,
    locations: PropTypes.array(PropTypes.instanceOf(LocationModel)).isRequired
  }

  static isLanguageCode (language) {
    return language && language.length === LANGUAGE_CODE_LENGTH
  }

  redirectCondition = location => !RouterFragment.isLanguageCode(location.params.language)
  isLocation = location => this.props.locations.find(_location => _location.code === location)

  render () {
    const {routeConfig, locations, viewportSmall} = this.props
    return <Fragment forRoute='/'>
      {/* Routes */}
      <React.Fragment>
        {/* No language was provided, so redirect to a specific language (e.g. the browsers language) */}
        <Fragment forRoute='/'>
          <I18nRedirect />
        </Fragment>

        {/* Matches /disclaimer */}
        <Fragment forRoute='/disclaimer'>
          <Layout header={<GeneralHeader viewportSmall={viewportSmall} />}
                  footer={<GeneralFooter />}><MainDisclaimerPage /></Layout>
        </Fragment>

        <Fragment forRoute='/:location' withConditions={this.isLocation}>
          <LocationFragment routeConfig={routeConfig} locations={locations} />
        </Fragment>

        {/* If language param is longer than 2, it is no language and is probably a location
        -> redirect the language-specific location */}
        <Fragment forRoute='/:language(/)' withConditions={this.redirectCondition}>
          <I18nRedirect />
        </Fragment>

        {/* Matches one or zero arguments like /de */}
        <Fragment forRoute='/:language(/)'>
          <Layout footer={<GeneralFooter />}><LandingPage /></Layout>
        </Fragment>

        {/* There are no missing routes. Covered:
          * Two or more arguments (Search/Disclaimer/Events/PdfFetcher/CategoriesPage)
          * One argument (MainDisclaimer or LandingPage with language preselection)
          * No arguments (LandingPage)
          */}

      </React.Fragment>
    </Fragment>
  }
}

const mapStateToProps = state => ({
  viewportSmall: state.viewport.is.small
})

export default connect(mapStateToProps)(RouterFragment)
