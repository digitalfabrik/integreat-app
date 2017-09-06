import React from 'react'
import PropTypes from 'prop-types'

import style from './Breadcrumb.css'
import Hierarchy from 'routes/LocationPage/Hierarchy'
import { Link } from 'redux-little-router'

export default class Breadcrumb extends React.Component {
  static propTypes = {
    hierarchy: PropTypes.instanceOf(Hierarchy).isRequired,
    location: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired
  }

  render () {
    let hierarchy = this.props.hierarchy
    return <div className={style.breadcrumbs}>{hierarchy.map((page, path) => {
      return (
        <Link key={page.id}
              className={style.breadcrumb}
              href={`/${this.props.language}/${this.props.location}/location${path}`}>
          <span className={style.separator}/>
          <span className={style.level}>{page.title}</span>
        </Link>
      )
    })}</div>
  }
}
