// @flow

import React from 'react'
import RouteHelper from './RouteHelper'
import MainDisclaimerPage from '../../../../routes/main-disclaimer/components/MainDisclaimerPage'
import type { GetPageTitleParamsType } from '../types'

const renderMainDisclaimerPage = () => <MainDisclaimerPage />

const mainDisclaimerRouteHelper: RouteHelper<void> = new RouteHelper({
  renderPage: renderMainDisclaimerPage,
  getRequiredPayloads: () => {},
  getPageTitle: ({t}: GetPageTitleParamsType) => t('pageTitles.mainDisclaimer')
})

export default mainDisclaimerRouteHelper
