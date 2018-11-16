// @flow

import React from 'react'
import Payload from '../../../endpoint/Payload'
import CityModel from '../../../endpoint/models/CityModel'
import type { AllPayloadsType, GetPageTitleParamsType } from '../types'
import Route from './RouteHelper'
import LandingPage from '../../../../routes/landing/containers/LandingPage'

type RequiredPayloadType = {|cities: Payload<Array<CityModel>>|}

const renderLandingPage = ({cities}: RequiredPayloadType) =>
  <LandingPage cities={cities.data} />

const getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadType => ({cities: payloads.citiesPayload})

const getPageTitle = ({t}: GetPageTitleParamsType) => t('pageTitles.landing')

const landingRouteHelper: Route<RequiredPayloadType> = new Route({
  renderPage: renderLandingPage,
  getRequiredPayloads,
  getPageTitle
})

export default landingRouteHelper
