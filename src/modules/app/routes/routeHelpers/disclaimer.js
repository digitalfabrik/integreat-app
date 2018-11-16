// @flow

import React from 'react'
import { getDisclaimerPath } from '../disclaimer'
import Route from './RouteHelper'
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
  `${t('disclaimerPageTitle')} - ${cityName}`

const disclaimerRouteHelper: Route<RequiredPayloadType> = new Route({
  renderPage: renderDisclaimerPage,
  getRequiredPayloads,
  getLanguageChangePath,
  getPageTitle
})

export default disclaimerRouteHelper
