// @flow

import React from 'react'
import { connect } from 'react-redux'
import LandingPage from '../../routes/landing/containers/LandingPage'
import Spinner from 'react-spinkit'
import LocationModel from '../endpoint/models/LocationModel'
import Layout from '../layout/components/Layout'
import LocationLayout from '../layout/containers/LocationLayout'
import MainDisclaimerPage from '../../routes/main-disclaimer/components/MainDisclaimerPage'
import GeneralFooter from '../layout/components/GeneralFooter'
import GeneralHeader from '../layout/components/GeneralHeader'

type Props = {
  viewportSmall: boolean,
  currentRoute: string,
  locations: Array<LocationModel>
}

class Switcher extends React.Component<Props> {
  getComponent () {
    switch (this.props.currentRoute) {
      case 'LANDING':
        return this.props.locations ? <LandingPage /> : <Spinner name='line-scale-party' />
      case 'MAIN_DISCLAIMER':
        return <MainDisclaimerPage />
    }
  }

  render () {
    const {viewportSmall, currentRoute} = this.props
    return currentRoute === 'LANDING' || currentRoute === 'MAIN_DISCLAIMER'
      ? <Layout header={<GeneralHeader viewportSmall={viewportSmall} />}
                footer={<GeneralFooter />}>
          {this.getComponent()}
        </Layout>
      : <LocationLayout>
          {this.getComponent()}
        </LocationLayout>
  }
}

const mapStateToProps = state => ({
  viewportSmall: state.viewport.is.small,
  currentRoute: state.location.type,
  locations: state.locationModels.locations
})

export default connect(mapStateToProps)(Switcher)
