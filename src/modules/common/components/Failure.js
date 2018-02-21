import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import FontAwesome from 'react-fontawesome'

import style from './Failure.css'
import { Link } from 'redux-little-router'

/**
 * Our error component, but since the name Error collides with the ES6 class, we've called it Failure
 */
export class Failure extends React.Component {
  static propTypes = {
    error: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired
  }

  render () {
    const {t, error} = this.props
    return <div>
      <div className={style.centerText}>{t(error)}</div>
      <div className={style.centerText}><FontAwesome name='frown-o' size='5x' /></div>
      <Link className={style.centerText} href={'/'}>{t('goToStart')}</Link>
    </div>
  }
}

export default translate('common')(Failure)
