// @flow

import * as React from 'react'
import { connect } from 'react-redux'
import { PageModel } from 'api-client'
import type { StateType } from '../../../modules/app/StateType'
import Page from '../../../modules/common/components/Page'
import { push } from 'redux-first-router'

type PropsType = {|
  disclaimer: PageModel,
  language: string
|}

/**
 * Displays the locations disclaimer matching the route /<location>/<language>/disclaimer
 */
export class DisclaimerPage extends React.Component<PropsType> {
  render () {
    const { disclaimer, language } = this.props

    return (
      <Page lastUpdate={disclaimer.lastUpdate}
            title={disclaimer.title}
            content={disclaimer.content}
            language={language}
            onInternalLinkClick={push} />
    )
  }
}

const mapStateTypeToProps = (stateType: StateType) => ({
  language: stateType.location.payload.language
})

export default connect<*, *, *, *, *, *>(mapStateTypeToProps)(DisclaimerPage)
