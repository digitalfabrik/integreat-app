// @flow

import React from 'react'

import type { AllPayloadsType, GetLanguageChangePathParamsType, GetPageTitleParamsType } from '../types'
import RouteHelper from './RouteHelper'
import ExtrasPage from '../../../../routes/extras/containers/ExtrasPage'
import Payload from '../../../endpoint/Payload'
import ExtraModel from '../../../endpoint/models/ExtraModel'
import { getExtrasPath } from '../extras'

type RequiredPayloadType = {|extras: Payload<Array<ExtraModel>>|}

const renderExtrasPage = ({extras}: RequiredPayloadType) =>
  <ExtrasPage extras={extras.data} />

const getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadType =>
  ({extras: payloads.extrasPayload})

const getLanguageChangePath = ({location, language}: GetLanguageChangePathParamsType) =>
  getExtrasPath({city: location.payload.city, language})

const getPageTitle = ({t, cityName}: GetPageTitleParamsType) =>
  `${t('pageTitle')} - ${cityName}`

const extrasRouteHelper: RouteHelper<RequiredPayloadType> = new RouteHelper({
  renderPage: renderExtrasPage,
  getRequiredPayloads,
  getLanguageChangePath,
  getPageTitle
})

export default extrasRouteHelper
