import React from 'react'
import PropTypes from 'prop-types'

import withFetcher from 'modules/endpoint/hocs/withFetcher'
import SprungbrettJobModel from 'modules/endpoint/models/SprungbrettJobModel'
import SprungbrettList from '../components/SprungbrettList'
import Caption from '../../../modules/common/components/Caption'

export class SprungbrettPage extends React.Component {
  static propTypes = {
    sprungbrett: PropTypes.arrayOf(PropTypes.instanceOf(SprungbrettJobModel)).isRequired
  }

  render () {
    return <div >
      <Caption title={'Sprungbrett'} />
      <SprungbrettList jobs={this.props.sprungbrett} />
    </div>
  }
}

export default withFetcher('sprungbrett')(SprungbrettPage)
