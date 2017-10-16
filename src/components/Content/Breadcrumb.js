import React from 'react'
import PropTypes from 'prop-types'

import style from './Breadcrumb.css'
import Hierarchy from 'routes/LocationPage/Hierarchy'
import { Link } from 'redux-little-router'
import LocationModel from '../../endpoints/models/LocationModel'
import { LocationFetcher } from '../../endpoints/index'

class BreadcrumbAdapter extends React.Component {
  static propTypes = {
    location: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    hierarchy: PropTypes.instanceOf(Hierarchy).isRequired,
    locations: PropTypes.arrayOf(PropTypes.instanceOf(LocationModel))
  }

  getFormattedTitle (page) {
    const location = this.props.locations.find((location) => location.code === page.title)

    if (location) {
      return location.name
    }

    return null
  }

  render () {
    const hierarchy = this.props.hierarchy
    return (
      <div className={style.breadcrumbs}>{hierarchy.map((page, path) => {
        return (
          <Link key={page.id} className={style.breadcrumb}
                href={`/${this.props.location}/${this.props.language}${path}`}>
            <span className={style.separator}/>
            <span className={style.level}>{this.getFormattedTitle(page) || page.title}</span>
          </Link>
        )
      })}
      </div>
    )
  }
}

class Breadcrumb extends React.Component {
  static propTypes = {
    hierarchy: PropTypes.instanceOf(Hierarchy).isRequired,
    location: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired
  }

  render () {
    return <LocationFetcher hideSpinner={true}>
      <BreadcrumbAdapter hierarchy={this.props.hierarchy} language={this.props.language}
                         location={this.props.location}/>
    </LocationFetcher>
  }
}

export default Breadcrumb
