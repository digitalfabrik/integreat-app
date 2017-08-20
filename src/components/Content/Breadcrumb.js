import React from 'react'
import PropTypes from 'prop-types'

import style from './Breadcrumb.css'
import Hierarchy from 'routes/LocationPage/Hierarchy'
import { Link } from 'react-router-dom'
import helper from 'components/Helper/Helper.css'

export default class Breadcrumb extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    hierarchy: PropTypes.instanceOf(Hierarchy).isRequired,
    location: PropTypes.string.isRequired
  }

  render () {
    return (
      <div className={this.props.className}>{this.props.hierarchy.map((page, path) => {
        return (
          <Link className={helper.removeA} key={page.id}
                to={'/location/' + this.props.location + path}>
            <span className={style.separator}/>
            <span className={style.level}>{ page.title }</span>
          </Link>
        )
      })}
      </div>
    )
  }
}
