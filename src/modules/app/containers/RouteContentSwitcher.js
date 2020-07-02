// @flow

import * as React from 'react'
import type { LocationState } from 'redux-first-router'
import type { AllPayloadsType } from '../route-configs/RouteConfig'
import { Payload } from '@integreat-app/integreat-api-client'
import { find, reduce } from 'lodash'
import LoadingSpinner from '../../common/components/LoadingSpinner'
import FailureSwitcher from '../../common/components/FailureSwitcher'
import { getRouteConfig } from '../route-configs'
import { getRouteContent } from '../routeContents'
import { SPRUNGBRETT_OFFER } from '../route-configs/SprungbrettRouteConfig'
import { WOHNEN_OFFER } from '../route-configs/WohnenRouteConfig'
import ContentNotFoundError from '../../common/errors/ContentNotFoundError'

type PropsType = {|
  location: LocationState,
  allPayloads: AllPayloadsType
|}

class RouteContentSwitcher extends React.PureComponent<PropsType> {
  renderFailureLoadingComponents = (payloads: {[string]: Payload<any>}): React.Node => {
    const errorPayload = find(payloads, payload => payload.error)
    if (find(payloads, payload => (payload.isFetching || !payload.data) && !payload.error)) {
      return <LoadingSpinner />
    } else if (errorPayload) {
      return <FailureSwitcher error={errorPayload.error} />
    }
    return null
  }

  isWaitingForOffer = (offerType: 'wohnenOffer' | 'sprungbrettJobs', payloads: {[string]: Payload<any>}): boolean => {
    const alias = offerType === 'wohnenOffer' ? WOHNEN_OFFER : SPRUNGBRETT_OFFER
    return payloads[offerType] && !find(payloads.offers.data, offer => offer.alias === alias)
  }

  renderOfferFailure = (payloads: {[string]: Payload<any>}, location: LocationState): React.Node => {
    if (payloads.offers && !payloads.offers.isFetching && payloads.offers.data && !payloads.offers.error) {
      if (this.isWaitingForOffer('wohnenOffer', payloads) || this.isWaitingForOffer('sprungbrettJobs', payloads)) {
        return <FailureSwitcher error={new ContentNotFoundError({
          type: 'offer',
          id: location.pathname,
          city: location.payload.city,
          language: location.payload.language
        })} />
      }
    }
    return null
  }

  render () {
    const { location, allPayloads } = this.props
    const currentRoute = location.type
    const RouteContent = getRouteContent(currentRoute)
    const payloads = getRouteConfig(currentRoute).getRequiredPayloads(allPayloads)
    return this.renderOfferFailure(payloads, location) ||
      this.renderFailureLoadingComponents(payloads) ||
      <RouteContent {...reduce(payloads, (result, value, key: string) => ({ [key]: value.data, ...result }), {})} />
  }
}

export default RouteContentSwitcher
