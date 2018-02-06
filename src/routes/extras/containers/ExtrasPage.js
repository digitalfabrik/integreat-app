import React from 'react'
import PropTypes from 'prop-types'

import withFetcher from 'modules/endpoint/hocs/withFetcher'
import ExtraModel from 'modules/endpoint/models/ExtraModel'

export class ExtrasPage extends React.Component {
  static propTypes = {
    extras: PropTypes.arrayOf(PropTypes.instanceOf(ExtraModel)).isRequired
  }

  render () {
    return <div>
      {this.props.extras.map(extra => <div>{extra.name}</div>)}
    </div>
  }
}

export default withFetcher('extras')(ExtrasPage)
