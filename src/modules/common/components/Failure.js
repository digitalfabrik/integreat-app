// @flow

import React from 'react'
import { translate } from 'react-i18next'
import FontAwesome from 'react-fontawesome'

import Link from 'redux-first-router-link'

import { goToI18nRedirect } from '../../app/routes/i18nRedirect'
import { Centered } from './Failure.styles'
import type { Action } from 'redux-first-router/dist/flow-types'
import type { I18nTranslate } from '../../../flowTypes'

type Props = {
  errorMessage: string,
  goToAction: ?Action,
  goToMessage: ?string,
  t: I18nTranslate
}

/**
 * Our error component, but since the name Error collides with the ES6 class, we've called it Failure
 */
export class Failure extends React.Component<Props> {
  render () {
    const {t, errorMessage, goToAction, goToMessage} = this.props
    return <Centered>
      <div>{t(errorMessage)}</div>
      <div><FontAwesome name='frown-o' size='5x' /></div>
      <Link to={goToAction || goToI18nRedirect()}>{t(goToMessage || 'goTo.start')}</Link>
    </Centered>
  }
}

export default translate('error')(Failure)
