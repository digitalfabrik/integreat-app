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
import Failure from '../../common/components/Failure'

const LANGUAGE_CODE_MIN_LENGTH = 2
const LANGUAGE_CODE_MAX_LENGTH = 3

export class RouterFragment extends React.Component {
  static propTypes = {
    viewportSmall: PropTypes.bool.isRequired,
    routeConfig: PropTypes.instanceOf(RouteConfig).isRequired,
    locations: PropTypes.arrayOf(PropTypes.instanceOf(LocationModel)).isRequired
  }

  isLanguageCode = router => router.params.location && router.params.location.length >= LANGUAGE_CODE_MIN_LENGTH &&
    router.params.location.length <= LANGUAGE_CODE_MAX_LENGTH

  isLocation = router => this.props.locations.find(location => location.code === router.params.location)

  render () {
    const {routeConfig, locations, viewportSmall} = this.props

    return <Fragment forRoute='/'>
      <React.Fragment>
        {/* No language was provided, so redirect to a specific language (e.g. the browsers language) */}
        <Fragment forRoute='/'>
          <I18nRedirect />
        </Fragment>

        {/* Matches /disclaimer */}
        <Fragment forRoute='/disclaimer'>
          <Layout header={<GeneralHeader viewportSmall={viewportSmall} />}
                  footer={<GeneralFooter />}>
            <MainDisclaimerPage />
          </Layout>
        </Fragment>

        <Fragment forRoute='/:location/:language(/*)' withConditions={this.isLocation}>
          <LocationFragment routeConfig={routeConfig} locations={locations} />
        </Fragment>

        <Fragment forRoute='/:location(/)' withConditions={this.isLocation}>
          <I18nRedirect />
        </Fragment>

        {/* Matches one or zero arguments like /de */}
        <Fragment forRoute='/:location(/)' withConditions={this.isLanguageCode}>
          <Layout footer={<GeneralFooter />}>
            <LandingPage locations={locations} />
          </Layout>
        </Fragment>

        <Fragment forNoMatch>
          <Failure />
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
