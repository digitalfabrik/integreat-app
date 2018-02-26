import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'redux-little-router'
import cx from 'classnames'

import style from './Selector.css'
import SelectorItemModel from '../SelectorItemModel'

/**
 * Displays a Selector showing different items
 */
export default class Selector extends React.Component {
  static propTypes = {
    verticalLayout: PropTypes.bool,
    closeDropDownCallback: PropTypes.func,
    items: PropTypes.arrayOf(PropTypes.instanceOf(SelectorItemModel)).isRequired,
    active: PropTypes.string.isRequired
  }

  getItems () {
    return this.props.items.map(item => {
      if (item.code === this.props.active) {
        return (
          <span key={item.code}
                className={cx(style.element, style.elementActive)}
                onClick={this.props.closeDropDownCallback}>
            {item.name}
            </span>
        )
      } else {
        return (
          <Link key={item.code}
                className={style.element}
                onClick={this.props.closeDropDownCallback}
                href={item.path}>
            {item.name}
          </Link>
        )
      }
    })
  }

  render () {
    return (
      <div className={cx({[style.selector]: true, [style.vertical]: this.props.verticalLayout})}>
        {this.getItems()}
      </div>
    )
  }
}
