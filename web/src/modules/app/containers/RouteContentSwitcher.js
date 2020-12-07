// @flow

import * as React from 'react'
import type { LocationState } from 'redux-first-router'
import { NotFoundError, Payload, SPRUNGBRETT_OFFER, WOHNEN_OFFER } from 'api-client'
import { find, reduce } from 'lodash'
import LoadingSpinner from '../../common/components/LoadingSpinner'
import FailureSwitcher from '../../common/components/FailureSwitcher'
import { getRouteContent } from '../routeContents'

type PropsType = {|
  location: LocationState,
  payloads: { [string]: Payload<any> },
  isLoading: boolean
|}

class RouteContentSwitcher extends React.PureComponent<PropsType> {
  renderFailureLoadingComponents = (): React.Node => {
    const { isLoading, payloads } = this.props

    const errorPayload = find(payloads, payload => payload.error)

    if (isLoading) {
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

  renderOfferFailure = (): React.Node => {
    const { payloads, location } = this.props
    if (payloads.offers && !payloads.offers.isFetching && payloads.offers.data && !payloads.offers.error) {
      if (this.isWaitingForOffer('wohnenOffer', payloads) || this.isWaitingForOffer('sprungbrettJobs', payloads)) {
        return <FailureSwitcher error={new NotFoundError({
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
    const { location, payloads } = this.props
    const currentRoute = location.type
    const RouteContent = getRouteContent(currentRoute)

    return this.renderOfferFailure() ||
      this.renderFailureLoadingComponents() ||
      <RouteContent {...reduce(payloads, (result, value, key: string) => ({ [key]: value.data, ...result }), {})} />
  }
}

export default RouteContentSwitcher
