import React from 'react'
import PropTypes from 'prop-types'

import ExtraModel from 'modules/endpoint/models/ExtraModel'

import PlaceholderIcon from 'routes/categories/assets/IconPlaceholder.svg'

export default class ExtrasPage extends React.Component {
  static propTypes = {
    extra: PropTypes.instanceOf(ExtraModel).isRequired
  }

  render () {
    const extra = this.props.extra

    return <a href={extra.url}>
      <img src={extra.thumbnail || PlaceholderIcon} />
      {extra.name}
    </a>
  }
}
