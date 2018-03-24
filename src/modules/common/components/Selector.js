import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import SelectorItemModel from '../models/SelectorItemModel'
import Link from 'redux-first-router-link'
import { ActiveElement, Element, Wrapper } from './Selector.styles'

/**
 * Displays a Selector showing different items
 */
class Selector extends React.Component {
  static propTypes = {
    verticalLayout: PropTypes.bool,
    closeDropDownCallback: PropTypes.func,
    items: PropTypes.arrayOf(PropTypes.instanceOf(SelectorItemModel)).isRequired,
    /** The code of the item which is currently active **/
    activeItemCode: PropTypes.string
  }

  getItems () {
    return this.props.items.map(item => {
      if (item.code === this.props.activeItemCode) {
        return (
          <ActiveElement key={item.code}
                         onClick={this.props.closeDropDownCallback}>
            {item.name}
          </ActiveElement>
        )
      } else {
        return (
          <Element key={item.code}
                onClick={this.props.closeDropDownCallback}
                to={item.href}>
            {item.name}
          </Element>
        )
      }
    })
  }

  render () {
    return (
      <Wrapper vertical={this.props.verticalLayout}>
        {this.getItems()}
      </Wrapper>
    )
  }
}

export default Selector
