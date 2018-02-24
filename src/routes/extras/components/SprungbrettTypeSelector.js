import React from 'react'
import PropTypes from 'prop-types'

import Caption from '../../../modules/common/components/Caption'

class SprungbrettTypeSelector extends React.Component {
  static propTypes = {
    title: PropTypes.string
  }

  render () {
    return (
      <Caption title={this.props.title || 'Job Selector'} />
    )
  }
}

export default SprungbrettTypeSelector
