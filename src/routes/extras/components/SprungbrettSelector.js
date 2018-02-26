import React from 'react'
import PropTypes from 'prop-types'

import SelectorItemModel from '../../../modules/common/models/SelectorItemModel'
import Selector from '../../../modules/common/components/Selector'

class SprungbrettSelector extends React.Component {
  static propTypes = {
    basePath: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
  }

  // todo translate
  getItems () {
    return [
      new SelectorItemModel({code: 'all', name: 'All', path: `${this.props.basePath}/all`}),
      new SelectorItemModel({code: 'apprenticeships', name: 'Apprenticeship', path: `${this.props.basePath}/apprenticeships`}),
      new SelectorItemModel({code: 'employments', name: 'Employment', path: `${this.props.basePath}/employments`})
    ]
  }

  render () {
    return <Selector items={this.getItems()} active={this.props.type} />
  }
}

export default SprungbrettSelector
