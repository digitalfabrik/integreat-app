// @flow

import React from 'react'
import Payload from '../../../endpoint/Payload'
import CityModel from '../../../endpoint/models/CityModel'
import type { AllPayloadsType, GetPageTitleParamsType } from '../types'
import RouteConfig from './RouteConfig'
import LandingPage from '../../../../routes/landing/containers/LandingPage'
import { LANDING_ROUTE } from '../landing'

type RequiredPayloadType = {|cities: Payload<Array<CityModel>>|}

const renderLandingPage = ({cities}: RequiredPayloadType) =>
  <LandingPage cities={cities.data} />

const getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadType => ({cities: payloads.citiesPayload})

const getPageTitle = ({t}: GetPageTitleParamsType) => t('pageTitles.landing')

const landingRouteConfig: RouteConfig<RequiredPayloadType> = new RouteConfig({
  name: LANDING_ROUTE,
  renderPage: renderLandingPage,
  getRequiredPayloads,
  getPageTitle,
  getLanguageChangePath: () => null
})

export default landingRouteConfig
