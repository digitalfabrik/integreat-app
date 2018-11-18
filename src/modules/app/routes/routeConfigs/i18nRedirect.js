// @flow

import React from 'react'
import Payload from '../../../endpoint/Payload'
import CityModel from '../../../endpoint/models/CityModel'
import type { AllPayloadsType } from '../types'
import RouteConfig from './RouteConfig'
import I18nRedirectPage from '../../../../routes/i18nRedirect/containers/I18nRedirectPage'
import { I18N_REDIRECT_ROUTE } from '../i18nRedirect'

type RequiredPayloadType = {|cities: Payload<Array<CityModel>>|}

const renderI18nPage = ({cities}: RequiredPayloadType) =>
  <I18nRedirectPage cities={cities.data} />

const getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadType => ({cities: payloads.citiesPayload})

const i18nRedirectRouteConfig: RouteConfig<RequiredPayloadType> = new RouteConfig({
  name: I18N_REDIRECT_ROUTE,
  renderPage: renderI18nPage,
  getRequiredPayloads,
  getPageTitle: () => '',
  getLanguageChangePath: () => null
})

export default i18nRedirectRouteConfig
