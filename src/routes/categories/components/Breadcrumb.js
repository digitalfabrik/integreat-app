import React from 'react'
import PropTypes from 'prop-types'

import { Link } from 'redux-little-router'

import style from './Breadcrumb.css'
import CategoryModel from '../../../modules/endpoint/models/CategoryModel'
import LocationModel from '../../../modules/endpoint/models/LocationModel'

class Breadcrumb extends React.Component {
  static propTypes = {
    categories: PropTypes.arrayOf(PropTypes.instanceOf(CategoryModel)).isRequired,
    category: PropTypes.instanceOf(CategoryModel).isRequired,
    locations: PropTypes.arrayOf(PropTypes.instanceOf(LocationModel)).isRequired,
    baseUrl: PropTypes.string.isRequired
  }

  getUrl = (baseUrl, path) => baseUrl + '/' + path

  getLocationTitle = (location) => (this.props.locations.find(_location => location === _location.code)).name

  getBreadcrumbs (categories, currentCategory) {
    if (currentCategory.id === this.props.category.id && currentCategory.id === 0) return []

    if (currentCategory.id === 0) {
      return [{title: this.getLocationTitle(currentCategory.title), url: this.props.baseUrl}]
    }

    let breadcrumbs = this.getBreadcrumbs(categories, CategoryModel.getCategoryById(categories, currentCategory.parent))

    if (currentCategory.id !== this.props.category.id) {
      breadcrumbs.push({title: currentCategory.title, url: this.getUrl(this.props.baseUrl, currentCategory.url)})
    }
    return breadcrumbs
  }

  render () {
    const breadcrumbs = this.getBreadcrumbs(this.props.categories, this.props.category)

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

export default Breadcrumb
