// @flow

import React from 'react'
import { translate } from 'react-i18next'
import FontAwesome from 'react-fontawesome'

import Link from 'redux-first-router-link'

import { goToI18nRedirect } from 'modules/app/routes/i18nRedirect'
import { Centered } from './Failure.styles'
import type { Action } from 'redux-first-router'
import type { TFunction } from 'react-i18next'

type PropsType = {
  errorMessage: string,
  goToAction?: Action,
  goToMessage?: string,
  t: TFunction
}

/**
 * Our error component, but since the name Error collides with the ES6 class, we've called it Failure
 */
export class Failure extends React.Component<PropsType> {
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
