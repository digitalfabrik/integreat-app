import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'redux-little-router'
import cx from 'classnames'

import HeaderDropDown from './HeaderDropDown'
import style from './HeaderActionBar.css'

export const ACTION_ITEMS_PROP_TYPE = PropTypes.arrayOf(PropTypes.shape({
  iconSrc: PropTypes.string.isRequired,
  href: PropTypes.string,
  dropDownElement: PropTypes.element
}))

/**
 * Designed to work with Header. In the ActionBar you can display links and dropDowns involving actions like 'Change
 * language', 'Change location' or 'Search' and similar items.
 */
class HeaderActionBar extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    items: ACTION_ITEMS_PROP_TYPE.isRequired
  }

  render () {
    return <div className={cx(this.props.className, style.actionItems)}>
      {
        this.props.items.map(({iconSrc, href, dropDownNode}, index) => {
          return dropDownNode
            ? <HeaderDropDown key={index} iconSrc={iconSrc}>{dropDownNode}</HeaderDropDown>
            : <Link key={index} href={href}><img src={iconSrc} /></Link>
        })
      }
    </div>
  }
}

export default HeaderActionBar
