import React from 'react'
import PropTypes from 'prop-types'

import SprungbrettJobModel from 'modules/endpoint/models/SprungbrettJobModel'
import SprungbrettList from '../components/SprungbrettList'
import Caption from '../../../modules/common/components/Caption'

export default class SprungbrettPage extends React.Component {
  static propTypes = {
    sprungbrett: PropTypes.arrayOf(PropTypes.instanceOf(SprungbrettJobModel)).isRequired,
    title: PropTypes.string.isRequired
  }

  render () {
    return <React.Fragment >
      <Caption title={this.props.title} />
      <SprungbrettList jobs={this.props.sprungbrett} />
    </React.Fragment>
  }
}
