// @flow

import React from 'react'
import Payload from '../../../endpoint/Payload'
import CityModel from '../../../endpoint/models/CityModel'
import type { AllPayloadsType } from '../types'
import Route from './RouteHelper'
import I18nRedirectPage from '../../../../routes/i18nRedirect/containers/I18nRedirectPage'

type RequiredPayloadType = {|cities: Payload<Array<CityModel>>|}

const renderI18nPage = ({cities}: RequiredPayloadType) =>
  <I18nRedirectPage cities={cities.data} />

const getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadType => ({cities: payloads.citiesPayload})

const i18nRedirectRouteHelper: Route<RequiredPayloadType> = new Route({
  renderPage: renderI18nPage,
  getRequiredPayloads,
  getPageTitle: () => ''
})

export default i18nRedirectRouteHelper
