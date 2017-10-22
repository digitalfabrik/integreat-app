import React from 'react'
import PropTypes from 'prop-types'

import { Link } from 'redux-little-router'

import Hierarchy from 'routes/LocationPage/Hierarchy'
import LOCATIONS_ENDPOINT from 'endpoints/location'
import withFetcher from 'endpoints/withFetcher'

import style from './Breadcrumb.css'

class Breadcrumb extends React.Component {
  static propTypes = {
    hierarchy: PropTypes.instanceOf(Hierarchy).isRequired,
    location: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired
  }

  getFormattedTitle (page) {
    const location = this.props.locations.find((location) => location.code === page.title)

    if (location) {
      return location.name
    }

    return null
  }

  render () {
    return <div className={style.breadcrumbs}>{this.props.hierarchy.map((page, path) => {
      if (page !== this.props.hierarchy.top()) {
        return (
          <Link key={page.id} className={style.breadcrumb}
                href={`/${this.props.location}/${this.props.language}${path}`}>
            <span className={style.separator}/>
            <span className={style.level}>{this.getFormattedTitle(page) || page.title}</span>
          </Link>
        )
      }
    })}
    </div>
  }
}

export default withFetcher(LOCATIONS_ENDPOINT, true, true)(Breadcrumb)
