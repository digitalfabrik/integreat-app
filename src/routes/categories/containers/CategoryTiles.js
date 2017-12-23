import React from 'react'
import PropTypes from 'prop-types'
import { Row } from 'react-flexbox-grid'

import PageModel from 'modules/endpoint/models/CategoryModel'
import LOCATIONS_ENDPOINT from 'modules/endpoint/endpoints/location'
import withFetcher from 'modules/endpoint/hocs/withFetcher'
import Caption from 'modules/common/components/Caption'
import CategoryTile from '../components/CategoryTile'

class CategoryTiles extends React.Component {
  static propTypes = {
    parentPage: PropTypes.instanceOf(PageModel).isRequired,
    pages: PropTypes.arrayOf(PropTypes.shape({
      page: PropTypes.instanceOf(PageModel).isRequired,
      url: PropTypes.string.isRequired
    })).isRequired
  }

  getTitle () {
    return this.props.locations.find((location) => location.code === this.props.parentPage.title).name
  }

  render () {
    return (
      <div>
        <Caption title={this.getTitle()}/>
        <Row>
          {this.props.pages.map(({page, url}) => <CategoryTile key={page.id} url={url} page={page}/>)}
        </Row>
      </div>
    )
  }
}

export default withFetcher(LOCATIONS_ENDPOINT, true, true)(CategoryTiles)
