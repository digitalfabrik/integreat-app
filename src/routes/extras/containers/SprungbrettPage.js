import React from 'react'
import PropTypes from 'prop-types'

import withFetcher from 'modules/endpoint/hocs/withFetcher'
import SprungbrettJobModel from 'modules/endpoint/models/SprungbrettJobModel'
import SprungbrettList from '../components/SprungbrettList'

export class SprungbrettPage extends React.Component {
  static propTypes = {
    sprungbrett: PropTypes.arrayOf(PropTypes.instanceOf(SprungbrettJobModel))
  }

  render () {
    return <SprungbrettList jobs={this.props.sprungbrett} />
  }
}

export default withFetcher('sprungbrett')(SprungbrettPage)
