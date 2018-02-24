import React from 'react'
import PropTypes from 'prop-types'
import compose from 'lodash/fp/compose'
import { connect } from 'react-redux'

import withFetcher from 'modules/endpoint/hocs/withFetcher'
import { setSprungbrettUrl } from 'modules/sprungbrett/actions/setSprungbrettUrl'

import ExtraModel from 'modules/endpoint/models/ExtraModel'
import ExtraTiles from '../components/ExtraTiles'
import SprungbrettPage from './SprungbrettPage'

const SPRUNGBRETT_NAME = 'sprungbrett'

export class ExtrasPage extends React.Component {
  static propTypes = {
    location: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    extra: PropTypes.string,
    extras: PropTypes.arrayOf(PropTypes.instanceOf(ExtraModel)).isRequired,
    setSprungbrettUrl: PropTypes.func.isRequired
  }

  componentWillMount () {
    if (this.props) {
      const sprungbrett = this.props.extras.find(extra => extra.type === 'ige-sbt')
      if (sprungbrett) {
        this.props.setSprungbrettUrl(sprungbrett.url.split('=')[1])
      }
    }
  }

  render () {
    return this.props.extra === SPRUNGBRETT_NAME ? <SprungbrettPage /> : <ExtraTiles extras={this.props.extras} location={this.props.location} language={this.props.language} />
  }
}

const mapStateToProps = (state) => ({
  location: state.router.params.location,
  language: state.router.params.language,
  extra: state.router.params.extra
})

const mapDispatchToProps = (dispatch) => ({
  setSprungbrettUrl: (url) =>
    dispatch(setSprungbrettUrl(url))
})

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withFetcher('extras')
)(ExtrasPage)
