import React from 'react'
import PropTypes from 'prop-types'
import compose from 'lodash/fp/compose'
import { connect } from 'react-redux'

import withFetcher from 'modules/endpoint/hocs/withFetcher'
import { setSprungbrettUrl } from 'modules/sprungbrett/actions/setSprungbrettUrl'

import ExtraModel from 'modules/endpoint/models/ExtraModel'
import ExtraTiles from '../components/ExtraTiles'

export class ExtrasPage extends React.Component {
  static propTypes = {
    location: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    extras: PropTypes.arrayOf(PropTypes.instanceOf(ExtraModel)).isRequired,
    setSprungbrettUrl: PropTypes.func.isRequired
  }

  componentWillMount () {
    if (this.props) {
      const sprungbrett = this.props.extras.find(extra => extra.type === 'ige-sbt')
      if (sprungbrett) {
        this.props.setSprungbrettUrl(sprungbrett.url)
      }
    }
  }

  render () {
    return <ExtraTiles language={this.props.language} location={this.props.location} extras={this.props.extras} />
  }
}

const mapStateToProps = (state) => ({
  location: state.router.params.location,
  language: state.router.params.language
})

const mapDispatchToProps = (dispatch) => ({
  setSprungbrettUrl: (url) =>
    dispatch(setSprungbrettUrl(url))
})

export default compose(
  withFetcher('extras'),
  connect(mapStateToProps, mapDispatchToProps)
)(ExtrasPage)
