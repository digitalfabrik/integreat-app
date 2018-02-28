import React from 'react'
import PropTypes from 'prop-types'

import withFetcher from 'modules/endpoint/hocs/withFetcher'
import SprungbrettJobModel from 'modules/endpoint/models/SprungbrettJobModel'
import SprungbrettList from '../components/SprungbrettList'

import compose from 'lodash/fp/compose'

import style from './SprungbrettPage.css'

export class SprungbrettPage extends React.Component {
  static propTypes = {
    sprungbrett: PropTypes.arrayOf(PropTypes.instanceOf(SprungbrettJobModel)).isRequired
  }

  render () {
    return <div className={style.container}>
      <SprungbrettList jobs={this.props.sprungbrett} />
    </div>
  }
}

export default compose(
  withFetcher('sprungbrett')
)(SprungbrettPage)
