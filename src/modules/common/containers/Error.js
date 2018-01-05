import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import FontAwesome from 'react-fontawesome'
import { goBack } from 'redux-little-router'
import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'

import style from './Error.css'

export class Error extends React.Component {
  static propTypes = {
    error: PropTypes.string.isRequired,
    goBack: PropTypes.func.isRequired
  }

  /**
   * Go back in history!!
   * @param event The click event
   */
  goBack (event) {
    event.preventDefault()
    this.props.goBack()
  }

  render () {
    return <div>
      <div className={style.centerText}>{this.props.t(this.props.error)}</div>
      <div className={style.centerText}><FontAwesome name='frown-o' size='5x' /></div>
      <a className={style.centerText} href='/' onClick={this.goBack}>Go back</a>
    </div>
  }
}

const mapDispatchToProps = (dispatch) => ({
  goBack: () => dispatch(goBack())
})

export default compose(
  connect(() => {}, mapDispatchToProps),
  translate('errors')
)(Error)
