import React from 'react'
import PropTypes from 'prop-types'

import withFetcher from 'modules/endpoint/hocs/withFetcher'
import SprungbrettJobModel from 'modules/endpoint/models/SprungbrettJobModel'
import SprungbrettList from '../components/SprungbrettList'
import Caption from '../../../modules/common/components/Caption'

export class SprungbrettPage extends React.Component {
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

export default withFetcher('sprungbrett')(SprungbrettPage)
