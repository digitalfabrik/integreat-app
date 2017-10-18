import React from 'react'
import PropTypes from 'prop-types'

import style from './TitledCategoriesTable.css'
import PageModel from 'endpoints/models/PageModel'
import CategoriesTable from './CategoriesTable'

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
      <div>
        <div className={style.title}>{this.props.parentPage.title}</div>
        <CategoriesTable categories={this.props.categories}/>
      </div>
    )
  }
}

export default TitledCategoriesTable
