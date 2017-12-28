import React from 'react'
import PropTypes from 'prop-types'
import { Row } from 'react-flexbox-grid'

import CategoryModel from 'modules/endpoint/models/CategoryModel'
import LocationModel from 'modules/endpoint/models/LocationModel'
import Caption from 'modules/common/components/Caption'
import CategoryTile from './CategoryTile'

/**
 * Displays a table of CategoryTiles
 */
class CategoryTiles extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    categories: PropTypes.arrayOf(PropTypes.instanceOf(CategoryModel)).isRequired,
    locations: PropTypes.arrayOf(PropTypes.instanceOf(LocationModel)).isRequired
  }

  /**
   * Since the title of our root category is not the real name of the location, we have to map it here
   * @param locations The locations to search in for the title
   * @param title The title to search for
   * @return name The name of our location
   */
  getLocationName (locations, title) {
    return locations.find((location) => location.code === title).name
  }

  render () {
    return (
      <div>
        <Caption title={this.getLocationName(this.props.locations, this.props.title)} />
        <Row>
          {this.props.categories.map(category =>
            <CategoryTile key={category.id}
                          category={category} />)}
        </Row>
      </div>
    )
  }
}

export default CategoryTiles
