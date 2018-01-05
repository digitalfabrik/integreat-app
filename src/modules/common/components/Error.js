import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import FontAwesome from 'react-fontawesome'

import style from './Error.css'

export class Error extends React.Component {
  static propTypes = {
    error: PropTypes.string.isRequired
  }

  render () {
    return <div>
      <div className={style.centerText}>{this.props.t(this.props.error)}</div>
      <div className={style.centerText}><FontAwesome name='frown-o' size='5x' /></div>
      <a className={style.centerText} href='/' onClick={this.goBack}>Go back</a>
    </div>
  }
}

export default translate('errors')(Error)
