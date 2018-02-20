import React from 'react'
import PropTypes from 'prop-types'

import CategoryModel from 'modules/endpoint/models/CategoryModel'
import LocationModel from 'modules/endpoint/models/LocationModel'
import Caption from 'modules/common/components/Caption'
import CategoryTile from './CategoryTile'
import { Row } from 'react-flexbox-grid'

import style from './CategoryTiles.css'

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
   * Our root categories don't have the right title (location code instead of location title), so we have to compare the
   * title of the root category with the code of every location
   * @param {String} title The title of the category to search for
   * @return {String} The found name or the given title
   */
  getLocationName (title) {
    const location = this.props.locations.find(_location => title === _location.code)
    return location ? location.name : title
  }

  render () {
    return (
      <div>
        <Caption title={this.getLocationName(this.props.title)} />
        <Row className={style.categoryTiles}>
          {this.props.categories.map(category =>
            <CategoryTile key={category.id}
                          category={category} />)}
        </Row>
      </div>
    )
  }
}

export default CategoryTiles
