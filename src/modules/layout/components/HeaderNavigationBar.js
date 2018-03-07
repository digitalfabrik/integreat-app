import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import ReactTooltip from 'react-tooltip'
import { isEmpty } from 'lodash/lang'

import style from './HeaderNavigationBar.css'
import HeaderNavigationItem from '../HeaderNavigationItem'
import ConditionalLink from '../../common/components/ConditionalLink'

/**
 * Designed to work with Header. In the MenuBar you can display textual links. Should be used for navigating as a
 * main menu.
 */
class HeaderMenuBar extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.instanceOf(HeaderNavigationItem)).isRequired
  }

  render () {
    return <div
      className={cx(this.props.className, style.navigationBar, isEmpty(this.props.items) ? style.hidden : '')}>
      {this.props.items.map(item => (
        <ConditionalLink active={item.active} data-tip={!item.active ? item.tooltip : ''}
                         key={item.text}
                         className={cx(style.navigationItem, !item.active ? style.inactiveNavigationItem : (item.selected ? style.selectedNavigationItem : ''))}
                         href={item.href}>{item.text}
        </ConditionalLink>
      ))}

      <ReactTooltip place='top' type='dark' effect='solid' />

    </div>
  }
}

export default HeaderMenuBar
