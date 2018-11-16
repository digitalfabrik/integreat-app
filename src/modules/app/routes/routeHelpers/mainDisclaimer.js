// @flow

import React from 'react'
import Route from './RouteHelper'
import MainDisclaimerPage from '../../../../routes/main-disclaimer/components/MainDisclaimerPage'

const PAGE_TITLE = 'Impressum und Datenschutz - Integreat'

const renderMainDisclaimerPage = () => <MainDisclaimerPage />

const mainDisclaimerRouteHelper: Route<void> = new Route({
  renderPage: renderMainDisclaimerPage,
  getRequiredPayloads: () => {},
  getPageTitle: () => PAGE_TITLE
})

export default mainDisclaimerRouteHelper
