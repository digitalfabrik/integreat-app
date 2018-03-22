// @flow

import React from 'react'
import { translate } from 'react-i18next'
import FontAwesome from 'react-fontawesome'

import style from './Failure.css'
import Link from 'redux-first-router-link'

import type { Action } from 'redux-first-router/dist/flow-types'
import { goToI18nRedirect } from '../../app/routes/i18nRedirect'

type Props = {
  error: string,
  notFound: string,
  goTo: Action,
  goToMessage?: string,
  t: (string) => string
}

/**
 * Our error component, but since the name Error collides with the ES6 class, we've called it Failure
 */
export class Failure extends React.Component<Props> {
  render () {
    const {t, error, goTo, goToMessage, notFound} = this.props
    return <div>
      <div className={style.centerText}>{`${t(error)} ${notFound}`}</div>
      <div className={style.centerText}><FontAwesome name='frown-o' size='5x' /></div>
      <Link className={style.centerText} to={goTo || goToI18nRedirect()}>{goToMessage || t('goToStart')}</Link>
    </div>
  }
}

export default translate('common')(Failure)
