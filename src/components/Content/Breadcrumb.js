import React from 'react'
import PropTypes from 'prop-types'

import style from './Breadcrumb.css'
import Hierarchy from 'routes/LocationPage/Hierarchy'
import { Link } from 'react-router-dom'

export default class Breadcrumb extends React.Component {
  static propTypes = {
    hierarchy: PropTypes.instanceOf(Hierarchy).isRequired,
    location: PropTypes.string.isRequired
  }

  render () {
    let hierarchy = this.props.hierarchy
    return <div className={style.breadcrumbs}>{hierarchy.map((page, path) => {
      return (
        <Link className={style.breadcrumb} key={page.id}
              to={'/location/' + this.props.location + path}>
          <span className={style.separator}/>
          <span className={style.level}>{ page.title }</span>
        </Link>
      )
    })}</div>
  }
}
