// @flow

import React from 'react'
import { translate } from 'react-i18next'

import Toolbar from '../../../modules/layout/components/Toolbar'
import type { LocationState } from 'redux-first-router'
import FeedbackLink from '../../../routes/feedback/components/FeedbackLink'
import type { Node } from 'react'

type PropsType = {
  location: LocationState,
  children?: Node
}

export class LocationToolbar extends React.PureComponent<PropsType> {
  render () {
    const {location, children} = this.props

    return (
      <Toolbar>
        {children}
        <FeedbackLink isPositiveRatingLink location={location} />
        <FeedbackLink isPositiveRatingLink={false} location={location} />
        {/* todo: Add these functionalities:
                <ToolbarItem name='bookmark-o' text='Merken'href={this.getPdfFetchPath()} />
                <ToolbarItem name='share' text='Teilen' href={this.getPdfFetchPath()} />
                <ToolbarItem name='audio-description' text='Sprachausgabe' href={this.getPdfFetchPath()} /> */}
      </Toolbar>
    )
  }
}

export default translate('categories')(LocationToolbar)
