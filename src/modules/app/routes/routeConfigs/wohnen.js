// @flow

import React from 'react'
import type { AllPayloadsType, GetLanguageChangePathParamsType, GetPageTitleParamsType } from '../types'
import Payload from '../../../endpoint/Payload'
import ExtraModel from '../../../endpoint/models/ExtraModel'
import WohnenOfferModel from '../../../endpoint/models/WohnenOfferModel'
import RouteConfig from './RouteConfig'
import WohnenExtraPage from '../../../../routes/wohnen/containers/WohnenExtraPage'
import { getWohnenPath, WOHNEN_ROUTE } from '../wohnen'

type RequiredPayloadType = {|extras: Payload<Array<ExtraModel>>, offers: Payload<Array<WohnenOfferModel>>|}

const renderWohnenPage = ({offers, extras}: RequiredPayloadType) =>
  <WohnenExtraPage offers={offers.data} extras={extras.data} />

const getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadType =>
  ({offers: payloads.wohnenPayload, extras: payloads.extrasPayload})

const getLanguageChangePath = ({location, language}: GetLanguageChangePathParamsType) =>
  getWohnenPath({city: location.payload.city, language})

const getPageTitle = ({t, cityName}: GetPageTitleParamsType) =>
  `${t('pageTitles.wohnen')} - ${cityName}`

const wohnenRouteConfig: RouteConfig<RequiredPayloadType> = new RouteConfig({
  name: WOHNEN_ROUTE,
  renderPage: renderWohnenPage,
  getRequiredPayloads,
  getLanguageChangePath,
  getPageTitle
})

export default wohnenRouteConfig
