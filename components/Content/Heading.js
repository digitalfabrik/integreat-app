import React from 'react'
import PropTypes from 'prop-types'

import style from './Heading.pcss'

class Heading extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired
  }

  render () {
    return <h1 className={style.title}>{this.props.title}</h1>
  }
}

export default Heading
