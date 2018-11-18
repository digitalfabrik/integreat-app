// @flow

import React from 'react'

import type { AllPayloadsType, GetLanguageChangePathParamsType, GetPageTitleParamsType } from '../types'
import RouteConfig from './RouteConfig'
import ExtrasPage from '../../../../routes/extras/containers/ExtrasPage'
import Payload from '../../../endpoint/Payload'
import ExtraModel from '../../../endpoint/models/ExtraModel'
import { EXTRAS_ROUTE, getExtrasPath } from '../extras'

type RequiredPayloadType = {|extras: Payload<Array<ExtraModel>>|}

const renderExtrasPage = ({extras}: RequiredPayloadType) =>
  <ExtrasPage extras={extras.data} />

const getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadType =>
  ({extras: payloads.extrasPayload})

const getLanguageChangePath = ({location, language}: GetLanguageChangePathParamsType) =>
  getExtrasPath({city: location.payload.city, language})

const getPageTitle = ({t, cityName}: GetPageTitleParamsType) =>
  `${t('pageTitles.extras')} - ${cityName}`

const extrasRouteConfig: RouteConfig<RequiredPayloadType> = new RouteConfig({
  name: EXTRAS_ROUTE,
  renderPage: renderExtrasPage,
  getRequiredPayloads,
  getLanguageChangePath,
  getPageTitle
})

export default extrasRouteConfig
