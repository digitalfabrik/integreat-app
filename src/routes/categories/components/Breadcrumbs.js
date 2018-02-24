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

  /**
   * Our root categories don't have the right title (location code instead of location title), so we have to compare the
   * title of the root category with the code of every location
   * @param {String} title The title of the category to search for
   * @return {String} The found name or the given title
   */
  getLocationName (title) {
    const location = this.props.locations.find(_location => title === _location.code)
    return location ? location.name : title
  }

  getBreadcrumbs () {
    return this.props.parents.map(parent => {
      const title = parent.id === 0 ? this.getLocationName(parent.title) : parent.title
      return (
        <Link key={parent.url}
              className={style.breadcrumb}
              href={parent.url}>
          <span className={style.separator} />
          <span className={style.level}>{title}</span>
        </Link>
      )
    })
  }

  render () {
    return <div className={style.breadcrumbs}>
      {this.getBreadcrumbs()}
    </div>
  }
}

export default Breadcrumbs
