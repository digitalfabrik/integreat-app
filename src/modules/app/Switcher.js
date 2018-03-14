// @flow

import React from 'react'
import { connect } from 'react-redux'
import LandingPage from '../../routes/landing/containers/LandingPage'
import Spinner from 'react-spinkit'
import CityModel from '../endpoint/models/CityModel'
import Layout from '../layout/components/Layout'
import LocationLayout from '../layout/containers/LocationLayout'
import MainDisclaimerPage from '../../routes/main-disclaimer/components/MainDisclaimerPage'
import GeneralFooter from '../layout/components/GeneralFooter'
import GeneralHeader from '../layout/components/GeneralHeader'
import LanguageModel from '../endpoint/models/LanguageModel'
import CategoriesMapModel from '../endpoint/models/CategoriesMapModel'
import CategoriesPage from '../../routes/categories/containers/CategoriesPage'

type Props = {
  viewportSmall: boolean,
  currentRoute: string,
  cities: Array<CityModel>,
  languages: Array<LanguageModel>,
  categories: CategoriesMapModel
}

class Switcher extends React.Component<Props> {
  getComponent () {
    const {currentRoute, cities, languages, categories} = this.props
    const LoadingSpinner = () => <Spinner name='line-scale-party' />

    switch (currentRoute) {
      case 'LANDING':
        return cities ? <LandingPage /> : <LoadingSpinner />
      case 'MAIN_DISCLAIMER':
        return <MainDisclaimerPage />
      case 'CATEGORIES':
        return cities && languages && categories ? <CategoriesPage /> : <LoadingSpinner />
    }
  }

  render () {
    const {viewportSmall, currentRoute, cities, languages} = this.props

    return currentRoute === 'LANDING' || currentRoute === 'MAIN_DISCLAIMER'
      ? <Layout header={<GeneralHeader viewportSmall={viewportSmall} />}
                footer={<GeneralFooter />}>
          {this.getComponent()}
        </Layout>
      : cities && languages
        ? <LocationLayout>
            {this.getComponent()}
          </LocationLayout>
        : <Spinner name='line-scale-party' />
  }
}

const mapStateToProps = state => ({
  viewportSmall: state.viewport.is.small,
  currentRoute: state.location.type,
  cities: state.cities,
  languages: state.languages,
  categories: state.categories
})

export default connect(mapStateToProps)(Switcher)
