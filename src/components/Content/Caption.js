import React from 'react'
import PropTypes from 'prop-types'

import style from './Caption.css'

export default class Caption extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired
  }

  render () {
    return (
      <h1 className={style.caption}>{this.props.title}</h1>
    )
  }
}
