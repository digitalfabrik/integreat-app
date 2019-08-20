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

  render () {
    const { location, allPayloads } = this.props
    const currentRoute = location.type
    const RouteContent = getRouteContent(currentRoute)
    const payloads = getRouteConfig(currentRoute).getRequiredPayloads(allPayloads)
    return this.renderFailureLoadingComponents(payloads) ||
      <RouteContent {...reduce(payloads, (result, value, key: string) => ({ [key]: value.data, ...result }), {})} />
  }
}

export default RouteContentSwitcher
