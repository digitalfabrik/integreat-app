// @flow

import React from 'react'
import type { AllPayloadsType, GetLanguageChangePathParamsType, GetPageTitleParamsType } from '../types'
import Payload from '../../../endpoint/Payload'
import ExtraModel from '../../../endpoint/models/ExtraModel'
import WohnenOfferModel from '../../../endpoint/models/WohnenOfferModel'
import RouteHelper from './RouteHelper'
import WohnenExtraPage from '../../../../routes/wohnen/containers/WohnenExtraPage'
import { getWohnenPath } from '../wohnen'

type RequiredPayloadType = {|extras: Payload<Array<ExtraModel>>, offers: Payload<Array<WohnenOfferModel>>|}

const renderWohnenPage = ({offers, extras}: RequiredPayloadType) =>
  <WohnenExtraPage offers={offers.data} extras={extras.data} />

const getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadType =>
  ({offers: payloads.wohnenPayload, extras: payloads.extrasPayload})

const getLanguageChangePath = ({location, language}: GetLanguageChangePathParamsType) =>
  getWohnenPath({city: location.payload.city, language})

const getPageTitle = ({t, cityName}: GetPageTitleParamsType) =>
  `${t('pageTitle')} - ${cityName}`

const wohnenRouteHelper: RouteHelper<RequiredPayloadType> = new RouteHelper({
  renderPage: renderWohnenPage,
  getRequiredPayloads,
  getLanguageChangePath,
  getPageTitle
})

export default wohnenRouteHelper
