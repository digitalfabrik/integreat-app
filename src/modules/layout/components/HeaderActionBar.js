import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'redux-little-router'

import HeaderDropDown from './HeaderDropDown'
import style from './Header.css'

export const ACTION_ITEMS_PROP_TYPE = PropTypes.arrayOf(PropTypes.shape({
  iconSrc: PropTypes.string.isRequired,
  href: PropTypes.string,
  dropDownNode: PropTypes.node
}))

class HeaderActionBar extends React.Component {
  static propTypes = { items: ACTION_ITEMS_PROP_TYPE.isRequired }

  render () {
    return <div className={style.actionItems}>
      {
        this.props.items.map(({iconSrc, href, dropDownNode}, index) => {
          return dropDownNode
            ? <HeaderDropDown key={index} iconSrc={iconSrc}>{dropDownNode}</HeaderDropDown>
            : <Link key={index} href={href} className={style.actionItem}><img src={iconSrc} /></Link>
        })
      }
    </div>
  }
}

export default HeaderActionBar
