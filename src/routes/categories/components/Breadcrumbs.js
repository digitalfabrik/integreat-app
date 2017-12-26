import React from 'react'
import PropTypes from 'prop-types'

import { Link } from 'redux-little-router'

import CategoryModel from 'modules/endpoint/models/CategoryModel'
import LocationModel from 'modules/endpoint/models/LocationModel'

import style from './Breadcrumbs.css'

/**
 * Displays breadcrumbs (Links) for lower category levels
 */
class Breadcrumbs extends React.Component {
  static propTypes = {
    parents: PropTypes.arrayOf(PropTypes.instanceOf(CategoryModel)).isRequired,
    locations: PropTypes.arrayOf(PropTypes.instanceOf(LocationModel)).isRequired
  }

  getLocationTitle (title) {
    const location = this.props.locations.find(_location => title === _location.code)
    return location ? location.name : title
  }

  getBreadcrumbs () {
    return this.props.parents.map(parent => ({title: this.getLocationTitle(parent.title), url: parent.url}))
  }

  render () {
    const breadcrumbs = this.getBreadcrumbs()

    return <div className={style.breadcrumbs}>
      {breadcrumbs.map(breadcrumb => {
        return (
          <Link key={breadcrumb.url}
                className={style.breadcrumb}
                href={breadcrumb.url}>
            <span className={style.separator} />
            <span className={style.level}>{breadcrumb.title}</span>
          </Link>
        )
    })}
    </div>
  }
}

export default Breadcrumbs
