import React from 'react'
import PropTypes from 'prop-types'
import { Row } from 'react-flexbox-grid'

import CategoryModel from 'modules/endpoint/models/CategoryModel'
import Caption from 'modules/common/components/Caption'
import CategoryTile from './CategoryTile'
import LocationModel from '../../../modules/endpoint/models/LocationModel'

class CategoryTiles extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    baseUrl: PropTypes.string.isRequired,
    categories: PropTypes.arrayOf(PropTypes.instanceOf(CategoryModel)).isRequired,
    locations: PropTypes.arrayOf(PropTypes.instanceOf(LocationModel)).isRequired
  }

  static getUrl (baseUrl, path) {
    return baseUrl + '/' + path
  }

  getTitle () {
    return this.props.locations.find((location) => location.code === this.props.title).name
  }

  render () {
    return (
      <div>
        <Caption title={this.getTitle()} />
        <Row>
          {this.props.categories.map(category =>
            <CategoryTile key={category.id}
                          url={CategoryTiles.getUrl(this.props.baseUrl, category.url)}
                          category={category} />)}
        </Row>
      </div>
    )
  }
}

export default CategoryTiles
