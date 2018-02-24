import React from 'react'
import PropTypes from 'prop-types'

import { SelectorItem } from '../../../modules/common/SelectorItem'
import Selector from '../../../modules/common/containers/Selector'

class SprungbrettSelector extends React.Component {
  static propTypes = {
    basePath: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
  }

  // todo translate
  getItems () {
    return [
      new SelectorItem({code: 'all', name: 'All', path: `${this.props.basePath}/all`}),
      new SelectorItem({code: 'apprenticeships', name: 'Apprenticeship', path: `${this.props.basePath}/apprenticeships`}),
      new SelectorItem({code: 'employments', name: 'Employment', path: `${this.props.basePath}/employments`})
    ]
  }

  render () {
    return <Selector items={this.getItems()} active={this.props.type} />
  }
}

export default SprungbrettSelector
