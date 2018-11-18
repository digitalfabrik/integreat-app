// @flow

import React from 'react'
import RouteConfig from './RouteConfig'
import MainDisclaimerPage from '../../../../routes/main-disclaimer/components/MainDisclaimerPage'
import type { GetPageTitleParamsType } from '../types'

const renderMainDisclaimerPage = () => <MainDisclaimerPage />

const mainDisclaimerRouteConfig: RouteConfig<void> = new RouteConfig({
  renderPage: renderMainDisclaimerPage,
  getRequiredPayloads: () => {},
  getPageTitle: ({t}: GetPageTitleParamsType) => t('pageTitles.mainDisclaimer')
})

export default mainDisclaimerRouteConfig
