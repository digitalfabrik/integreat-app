// @flow

import * as React from 'react'
import { connect } from 'react-redux'
import { PageModel } from '@integreat-app/integreat-api-client'
import type { StateType } from '../../../modules/app/StateType'
import { pathToAction, setKind } from 'redux-first-router'
import type { Dispatch } from 'redux'
import type { ReceivedAction } from 'redux-first-router/dist/flow-types'
import Page from '../../../modules/common/components/Page'

type PropsType = {|
  disclaimer: PageModel,
  language: string,
  dispatch: ReceivedAction => void,
  routesMap: {}
|}

/**
 * Displays the locations disclaimer matching the route /<location>/<language>/disclaimer
 */
export class DisclaimerPage extends React.Component<PropsType> {
  redirectToPath = (path: string) => {
    const action = pathToAction(path, this.props.routesMap)
    setKind(action, 'push')
    this.props.dispatch(action)
  }

  render () {
    const {disclaimer, language} = this.props

    return (
      <Page lastUpdate={disclaimer.lastUpdate}
            title={disclaimer.title}
            content={disclaimer.content}
            language={language}
            onInternalLinkClick={this.redirectToPath} />
    )
  }
}

const mapStateTypeToProps = (stateType: StateType) => ({
  language: stateType.location.payload.language
})

const mapDispatchToProps = (dispatch: Dispatch<*>) => ({
  dispatch
})

export default connect(mapStateTypeToProps, mapDispatchToProps)(DisclaimerPage)
