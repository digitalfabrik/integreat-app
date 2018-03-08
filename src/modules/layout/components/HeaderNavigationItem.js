import cx from 'classnames'
import React from 'react'
import PropTypes from 'prop-types'
import ReactTooltip from 'react-tooltip'

import ConditionalLink from '../../common/components/ConditionalLink'
import style from './HeaderNavigationItem.css'

/**
 * HeaderNavigationItem is the data class which needs to be supplied to HeaderNavigationBar.
 */
class HeaderNavigationItem extends React.PureComponent {
  static propTypes = {
    /** text to be displayed */
    text: PropTypes.string.isRequired,
    /** link to the page that should be shown when the item is clicked */
    href: PropTypes.string.isRequired,
    /** true if the item is currently selected */
    selected: PropTypes.bool.isRequired,
    /** false if the item should be shown grayed out */
    active: PropTypes.bool.isRequired,
    /** the message to be displayed when the item is hovered */
    tooltip: PropTypes.bool
  }

  render () {
    const {active, text, tooltip, selected, href} = this.props
    return <React.Fragment>
      <ConditionalLink active={active} data-tip={!active ? tooltip : ''}
                       key={text}
                       className={cx(style.navigationItem, !active ? style.inactiveNavigationItem : (selected ? style.selectedNavigationItem : ''))}
                       href={href}>{text}
      </ConditionalLink>

      <ReactTooltip place='top' type='dark' effect='solid' />
    </React.Fragment>
  }
}

export default HeaderNavigationItem
