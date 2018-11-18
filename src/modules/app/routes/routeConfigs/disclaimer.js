// @flow

import React from 'react'
import { DISCLAIMER_ROUTE, getDisclaimerPath } from '../disclaimer'
import RouteConfig from './RouteConfig'
import type { AllPayloadsType, GetLanguageChangePathParamsType, GetPageTitleParamsType } from '../types'
import Payload from '../../../endpoint/Payload'
import PageModel from '../../../endpoint/models/PageModel'
import DisclaimerPage from '../../../../routes/disclaimer/containers/DisclaimerPage'

type RequiredPayloadType = {|disclaimer: Payload<PageModel>|}

const renderDisclaimerPage = ({disclaimer}: RequiredPayloadType) =>
  <DisclaimerPage disclaimer={disclaimer.data} />

const getRequiredPayloads = (payloads: AllPayloadsType) =>
  ({disclaimer: payloads.disclaimerPayload})

const getLanguageChangePath = ({location, language}: GetLanguageChangePathParamsType) =>
  getDisclaimerPath({city: location.payload.city, language})

const getPageTitle = ({t, cityName}: GetPageTitleParamsType) =>
  `${t('pageTitles.disclaimer')} - ${cityName}`

const disclaimerRouteConfig: RouteConfig<RequiredPayloadType> = new RouteConfig({
  name: DISCLAIMER_ROUTE,
  renderPage: renderDisclaimerPage,
  getRequiredPayloads,
  getLanguageChangePath,
  getPageTitle
})

export default disclaimerRouteConfig
