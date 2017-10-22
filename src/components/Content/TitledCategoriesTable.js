import React from 'react'
import PropTypes from 'prop-types'

import style from './TitledCategoriesTable.css'
import PageModel from 'endpoints/models/PageModel'
import CategoriesTable from './CategoriesTable'
import LocationModel from '../../endpoints/models/LocationModel'
import { LocationFetcher } from '../../endpoints/index'

class TitledCategoriesTableAdapter extends React.Component {
  static propTypes = {
    locations: PropTypes.arrayOf(PropTypes.instanceOf(LocationModel)),
    location: PropTypes.string.isRequired,
    categories: PropTypes.arrayOf(PropTypes.shape({
      page: PropTypes.instanceOf(PageModel).isRequired,
      url: PropTypes.string.isRequired
    })).isRequired
  }

  getTitle () {
    return this.props.locations.find((location) => location.code === this.props.location).name
  }

  render () {
    return (
      <div>
        <div className={style.title}>{this.getTitle()}</div>
        <CategoriesTable categories={this.props.categories}/>
      </div>
    )
  }
}

class TitledCategoriesTable extends React.Component {
  static propTypes = {
    parentPage: PropTypes.instanceOf(PageModel).isRequired,
    categories: PropTypes.arrayOf(PropTypes.shape({
      page: PropTypes.instanceOf(PageModel).isRequired,
      url: PropTypes.string.isRequired
    })).isRequired
  }

  render () {
    return (
      <LocationFetcher hideSpinner={true}>
        <TitledCategoriesTableAdapter location={this.props.parentPage.title} categories={this.props.categories}/>
      </LocationFetcher>
    )
  }
}

export default TitledCategoriesTable
