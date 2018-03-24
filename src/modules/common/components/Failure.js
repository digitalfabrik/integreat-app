import React from 'react'
import { translate } from 'react-i18next'
import FontAwesome from 'react-fontawesome'

import Link from 'redux-first-router-link'

import { goToI18nRedirect } from '../../app/routes/i18nRedirect'
import { Centered } from './Failure.styles'

type Props = {
  error: string,
  t: (string) => string
}

/**
 * Our error component, but since the name Error collides with the ES6 class, we've called it Failure
 */
export class Failure extends React.Component<Props> {
  render () {
    const {t, error} = this.props
    return <Centered>
      <div>{t(error)}</div>
      <div><FontAwesome name='frown-o' size='5x' /></div>
      <Link to={goToI18nRedirect}>{t('goToStart')}</Link>
    </Centered>
  }
}

export default translate('common')(Failure)
