// @flow

import * as React from 'react'
import { connect } from 'react-redux'
import { PageModel } from '@integreat-app/integreat-api-client'
import type { StateType } from '../../../modules/app/StateType'
import { pathToAction, redirect } from 'redux-first-router'
import type { Dispatch } from 'redux'
import type { ReceivedAction } from 'redux-first-router/dist/flow-types'
import Page from '../../../modules/common/components/Page'

type PropsType = {|
  disclaimer: PageModel,
  language: string,
  redirect: ReceivedAction => void,
  routesMap: {}
|}

/**
 * Displays the locations disclaimer matching the route /<location>/<language>/disclaimer
 */
export class DisclaimerPage extends React.Component<PropsType> {
  redirectToPath = (path: string) => {
    this.props.redirect(pathToAction(path, this.props.routesMap))
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
  redirect: action => dispatch(redirect(action))
})

export default connect(mapStateTypeToProps, mapDispatchToProps)(DisclaimerPage)
