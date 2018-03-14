// @flow

import React from 'react'

import Link from 'redux-first-router-link'

import style from './Breadcrumbs.css'
import CategoryModel from '../../../modules/endpoint/models/CategoryModel'

type Props = {
  parents: Array<CategoryModel>,
  locationName: string
}

/**
 * Displays breadcrumbs (Links) for lower category levels
 */
class Breadcrumbs extends React.Component<Props> {
  getBreadcrumbs () {
    return this.props.parents.map(parent => {
      const title = parent.id === 0 ? this.props.locationName : parent.title
      return (
        <Link key={parent.url}
              className={style.breadcrumb}
              to={parent.url}>
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
