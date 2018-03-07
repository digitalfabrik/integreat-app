// @flow

import React from 'react'

import { Link } from 'redux-little-router'

import LocationModel from 'modules/endpoint/models/LocationModel'

import style from './Breadcrumbs.css'
import type { CategoryType } from '../../../modules/endpoint/models/CategoryModel'

type Props = {
  parents: Array<CategoryType>,
  locations: Array<LocationModel>
}

/**
 * Displays breadcrumbs (Links) for lower category levels
 */
class Breadcrumbs extends React.Component<Props> {
  /**
   * Our root categories don't have the right title (location code instead of location title), so we have to compare the
   * title of the root category with the code of every location
   * @param {String} title The title of the category to search for
   * @return {String} The found name or the given title
   */
  getLocationName (title: string) {
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
