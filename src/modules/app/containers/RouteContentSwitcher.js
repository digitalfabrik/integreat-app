// @flow

import * as React from 'react'
import type { LocationState } from 'redux-first-router'
import type { AllPayloadsType } from '../route-configs/RouteConfig'
import { Payload } from '@integreat-app/integreat-api-client'
import find from 'lodash/find'
import LoadingSpinner from '../../common/components/LoadingSpinner'
import FailureSwitcher from '../../common/components/FailureSwitcher'
import { getRouteConfig } from '../route-configs'
import reduce from 'lodash/reduce'
import { getRouteContent } from '../routeContents'
import { SPRUNGBRETT_EXTRA } from '../route-configs/SprungbrettRouteConfig'
import { WOHNEN_EXTRA } from '../route-configs/WohnenRouteConfig'

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

  renderExtraFailure = (payloads: {[string]: Payload<any>}): React.Node => {
    if (payloads.extras && !payloads.extras.isFetching && payloads.extras.data && !payloads.extras.error) {
      if (payloads.offers && !find(payloads.extras.data, extra => extra.alias === WOHNEN_EXTRA)) {
        return <FailureSwitcher error={new Error('The Wohnen extra is not supported.')} />
      } else if (payloads.sprungbrettJobs && !find(payloads.extras.data, extra => extra.alias === SPRUNGBRETT_EXTRA)) {
        return <FailureSwitcher error={new Error('The Sprunbrett extra is not supported.')} />
      }
    }
    return null
  }

  render () {
    const { location, allPayloads } = this.props
    const currentRoute = location.type
    const RouteContent = getRouteContent(currentRoute)
    const payloads = getRouteConfig(currentRoute).getRequiredPayloads(allPayloads)
    return this.renderExtraFailure(payloads) ||
      this.renderFailureLoadingComponents(payloads) ||
      <RouteContent {...reduce(payloads, (result, value, key: string) => ({ [key]: value.data, ...result }), {})} />
  }
}

export default RouteContentSwitcher
